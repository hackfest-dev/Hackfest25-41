
import asyncio
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from ideas.models import Idea
from core.research_engine.scholar_pyppeteer_scraper import generate_keywords, scrape_google_scholar_and_abstracts
from chat.models import ChatMessage
from chat.serializers import MessageSerializer
from core.pusher import pusher_client
from asgiref.sync import sync_to_async, async_to_sync
import concurrent.futures
import asyncio
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from ideas.models import Idea
from core.research_engine.scholar_pyppeteer_scraper import generate_keywords, scrape_google_scholar_and_abstracts
from chat.models import ChatMessage
from chat.serializers import MessageSerializer
from core.pusher import pusher_client
from asgiref.sync import sync_to_async, async_to_sync

logger = logging.getLogger(__name__)

async def scrape_all_keywords(keywords):
    all_results = []
    for keyword in keywords:
        results = await scrape_google_scholar_and_abstracts(keyword, num_results_per_keyword=2)
        all_results.extend(results)
        await asyncio.sleep(5)  # Sleep between keywords to avoid rate limits
    return all_results

def run_scraping(keywords):
    return asyncio.run(scrape_all_keywords(keywords))

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

class ResearchAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, session_id):
        user = request.user

        # Fetch ideas for the session to build problem statement
        ideas_qs = Idea.objects.filter(session_id=session_id, user=user)
        if not ideas_qs.exists():
            return Response({"error": "No ideas found for this session and user"}, status=status.HTTP_404_NOT_FOUND)

        ideas = list(ideas_qs)
        problem_statement = "\n".join([idea.content for idea in ideas])

        # Generate keywords
        try:
            keywords = generate_keywords(problem_statement)
        except Exception as e:
            logger.error(f"Error generating keywords: {str(e)}")
            return Response({"error": "Failed to generate keywords for research"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not keywords:
            return Response({"error": "No keywords generated for research"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Scrape research results asynchronously in a separate process
        try:
            with concurrent.futures.ProcessPoolExecutor() as executor:
                future = executor.submit(run_scraping, keywords)
                research_results = future.result()
        except Exception as e:
            logger.error(f"Error during research scraping: {str(e)}")
            return Response({"error": "Failed to scrape research results"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"research_results": research_results}, status=status.HTTP_200_OK)
