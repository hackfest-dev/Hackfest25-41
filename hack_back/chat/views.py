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
