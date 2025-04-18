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
from core.theme_extractor import extract_themes_from_text
import logging
import PyPDF2
import pytesseract
from PIL import Image
import io
import json

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

        # Try to get text from form-data or JSON body
        text_data = request.data.get('text', "")
        if not text_data:
            try:
                body_unicode = request.body.decode('utf-8')
                body_data = json.loads(body_unicode)
                text_data = body_data.get('text', "")
            except Exception:
                text_data = ""

        logger.debug(f"Received file: {file_obj}, text_data: {text_data}")

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

        try:
            # Use core app theme extractor instead of AI service call
            result = extract_themes_from_text(combined_text)

            if not result:
                return Response({"error": "Failed to extract themes"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Check if result is dict with hackathon name and themes
            if isinstance(result, dict) and "hackathon name" in result and "themes" in result:
                hackathon_title = result["hackathon name"]
                themes = result["themes"]
            else:
                # Fallback: treat result as list of themes and generate title
                themes = result
                hackathon_title = themes[0]['name'] + " Hackathon" if themes else "Hackathon Session"

            # Save hackathon title in HackathonSession
            session = HackathonSession.objects.create(user=user, title=hackathon_title)
            # Optionally save the file as brochure if file_obj exists
            if file_obj:
                session.brochure.save(file_obj.name, file_obj, save=True)

            # Return themes as response
            return Response({"themes": themes}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Exception during theme extraction or DB save: {e}")
            return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
