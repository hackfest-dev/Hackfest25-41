from venv import logger
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import ChatMessage
from .serializers import MessageSerializer
from core.pusher import pusher_client
from ideas.models import Idea
import requests

# Create your views here.


class MessageAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        message_text = request.data.get("message")
        if not message_text:
            return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

        message = ChatMessage.objects.create(
            user=request.user,
            message=message_text
        )
        pusher_client.trigger('chat', 'message', {
            'username': request.user.username,
            'message': message.message,
            'timestamp': message.timestamp.isoformat()
        })
        return Response({"status": "Message sent"}, status=status.HTTP_201_CREATED)

class MessageListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            # Fetch all messages
            messages = ChatMessage.objects.all().order_by("timestamp")
            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            # Log the error for debugging
            logger.error(f"Error fetching messages: {str(e)}")
            return Response({"error": "Failed to fetch messages"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AIChatAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        user = request.user
        session_id = request.data.get("session_id")
        user_message = request.data.get("message")

        if not session_id:
            return Response({"error": "session_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not user_message:
            return Response({"error": "message is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch ideas for the session to build context
        ideas = Idea.objects.filter(session_id=session_id, user=user)
        if not ideas.exists():
            return Response({"error": "No ideas found for this session and user"}, status=status.HTTP_404_NOT_FOUND)

        idea_context = "\n".join([idea.content for idea in ideas])

        # Fetch recent chat messages for context (last 10)
        recent_chats = ChatMessage.objects.filter(session_id=session_id).order_by('-timestamp')[:10]
        recent_chats = reversed(recent_chats)  # to get chronological order

        # Construct messages payload for local LLM API
        system_prompt = "You are a helpful assistant. Use the following idea context to answer the user. Keep answers concise."
        messages_payload = [
            {"role": "system", "content": system_prompt},
            {"role": "system", "content": f"Idea context: {idea_context}"}
        ]

        # Add recent chat history to messages payload
        for chat in recent_chats:
            role = "user" if chat.sender == "user" else "assistant"
            messages_payload.append({"role": role, "content": chat.message})

        # Add current user message
        messages_payload.append({"role": "user", "content": user_message})

        # Call local LLM API
        try:
            response = requests.post(
                "http://localhost:1234/v1/chat/completions",
                json={
                    "model": "gemma-3-4b-it",
                    "messages": messages_payload,
                    "temperature": 0.7,
                    "max_tokens": 300,
                    "stream": False
                },
                timeout=30
            )
            response.raise_for_status()
            data = response.json()
            ai_message = data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
        except Exception as e:
            logger.error(f"Error calling AI service: {str(e)}")
            return Response({"error": "Failed to get response from AI service"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Save user message
        ChatMessage.objects.create(
            user=user,
            session_id=session_id,
            sender="user",
            message=user_message
        )

        # Save AI response
        ChatMessage.objects.create(
            user=user,
            session_id=session_id,
            sender="ai",
            message=ai_message
        )

        return Response({"response": ai_message}, status=status.HTTP_200_OK)
