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
from hackathon.models import ThemeSelection
from core.pusher import pusher_client
from core.theme_extractor import extract_themes_from_text
from core.scripts.main import process_themes
import logging
import io
import json
import os

# Create your views here.


class GenerateIdeasView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request, session_id):
        generated_ideas_path = os.path.join('core', 'scripts', 'generated_ideas.json')

        # For demonstration, define a theme for generation (could be dynamic)
        try:
            session = HackathonSession.objects.get(id=session_id)
        except HackathonSession.DoesNotExist:
            return Response({"error": "HackathonSession not found."}, status=404)

        # Get theme names from ThemeSelection related to this session
        theme_names = list(session.themes.values_list('theme_name', flat=True))
        if not theme_names:
            return Response({"error": "No themes found for this session."}, status=404)

        # Import the converter function from core.scripts.main
        from core.scripts.main import convert_theme_names_to_objects

        # Convert theme names to theme objects expected by process_themes
        themes = convert_theme_names_to_objects(theme_names)

        # Call process_themes with the list of theme objects and hackathon name
        process_themes(themes, "Hackathon")


        # Load updated generated_ideas.json to get all ideas
        with open(generated_ideas_path, 'r') as f:
            generated_data = json.load(f)

        all_ideas = generated_data.get("generated_ideas", [])

        # Prepare response data
        response_ideas = []
        for idea in all_ideas:
            response_ideas.append({
                "id": idea.get("id", ""),
                "theme": idea.get("topic", ""),
                "title": idea.get("text", "")[:50],  # Use first 50 chars as title
                "text": idea.get("text", "")
            })

        return Response({"session_id": session_id, "ideas": response_ideas}, status=200)
