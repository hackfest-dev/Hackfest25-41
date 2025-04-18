from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import HackathonSession
from core.pusher import pusher_client
from core.theme_extractor import extract_themes_from_text
from core import problem_generator, storage
import logging
import io
import json

# Create your views here.


class GenerateIdeasView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request, session_id):
        try:
            # Validate session exists
            session = HackathonSession.objects.filter(id=session_id).first()
            if not session:
                return Response({"error": "Invalid session_id"}, status=status.HTTP_404_NOT_FOUND)

            # Extract theme info from session or related data
            theme = {
                "name": session.theme_name if hasattr(session, 'theme_name') else "Default Theme",
                "code": session.theme_code if hasattr(session, 'theme_code') else "default",
                "description": session.theme_description if hasattr(session, 'theme_description') else "Default theme description",
                "keywords": session.theme_keywords if hasattr(session, 'theme_keywords') else []
            }

            # Get existing problems to avoid duplicates
            existing_problems = storage.get_existing_problem_texts()

            # Generate ideas using core problem_generator
            generated_ideas = problem_generator.generate_problem_statements(theme, search_results=[], existing_problems=existing_problems, max_ideas=3)

            # Store generated ideas temporarily in local JSON file
            storage.save_generated_ideas_detailed(session.hackathon_name if hasattr(session, 'hackathon_name') else "Default Hackathon", theme['name'], generated_ideas)

            # Return generated ideas as response
            return Response({"generated_ideas": generated_ideas}, status=status.HTTP_200_OK)

        except Exception as e:
            logging.error(f"Error generating ideas for session {session_id}: {str(e)}")
            return Response({"error": "Failed to generate ideas"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
