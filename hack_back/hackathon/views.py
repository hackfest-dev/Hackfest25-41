from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import HackathonSession, ThemeSelection
from core.pusher import pusher_client
import requests
import logging
import PyPDF2
import pytesseract
from PIL import Image
import io
import json
import mimetypes

# Create your views here.

# Initialize logger
logger = logging.getLogger(__name__)

def extract_text_from_pdf(file):
    try:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {e}")
        return ""

def extract_text_from_image(file):
    try:
        image = Image.open(file)
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        logger.error(f"Error extracting text from image: {e}")
        return ""

class CreateHackathonView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request, *args, **kwargs):
        user = request.user
        file_obj = request.FILES.get('file', None)
        text_data = request.data.get('text', "")

        extracted_text = ""

        # Extract text from file if present
        if file_obj:
            content_type = file_obj.content_type
            if content_type == 'application/pdf':
                extracted_text = extract_text_from_pdf(file_obj)
            elif content_type.startswith('image/'):
                extracted_text = extract_text_from_image(file_obj)
            else:
                return Response({"error": "Unsupported file type"}, status=status.HTTP_400_BAD_REQUEST)

        # Combine extracted text and text data
        combined_text = ""
        if extracted_text and text_data:
            combined_text = extracted_text + "\n" + text_data
        elif extracted_text:
            combined_text = extracted_text
        elif text_data:
            combined_text = text_data
        else:
            return Response({"error": "No input data provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Prepare payload for AI service
        payload = {
            "model": "gemma-3-1b-it",
            "messages": [
                {"role": "system", "content": "Extract themes for a hackathon from the provided text. Always return a json object with keys 'title' and 'themes'. The title should be a string and themes should be a list of strings."},
                {"role": "user", "content": combined_text}
            ],
            "temperature": 0.7,
            "max_tokens": -1,
            "stream": False
        }

        try:
            ai_response = requests.post(
                "http://localhost:1234/v1/chat/completions",
                headers={"Content-Type": "application/json"},
                data=json.dumps(payload)
            )
            if ai_response.status_code != 200:
                logger.error(f"AI service returned status {ai_response.status_code}: {ai_response.text}")
                return Response({"error": "AI service error"}, status=status.HTTP_502_BAD_GATEWAY)

            ai_json = ai_response.json()
            # Assuming AI returns JSON with keys 'title' and 'themes'
            hackathon_title = ai_json.get('title', None)
            themes = ai_json.get('themes', None)

            if not hackathon_title or themes is None:
                logger.error(f"AI response missing required fields: {ai_json}")
                return Response({"error": "Invalid AI response"}, status=status.HTTP_502_BAD_GATEWAY)

            # Save hackathon title in HackathonSession
            session = HackathonSession.objects.create(user=user, title=hackathon_title)
            # Optionally save the file as brochure if file_obj exists
            if file_obj:
                session.brochure.save(file_obj.name, file_obj, save=True)

            # Return themes as response
            return Response({"themes": themes}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Exception during AI service call or DB save: {e}")
            return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
