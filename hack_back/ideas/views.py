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
        import os
        from core import problem_generator, storage
        import json

        generated_ideas_path = os.path.join('core', 'generated_ideas.json')
        problem_statements_path = os.path.join('core', 'problem_statements.json')

        # For demonstration, define a theme for generation (could be dynamic)
        theme = {
            "name": "Default Theme",
            "code": "default",
            "description": "Default theme description",
            "keywords": ["innovation", "technology", "solution"]
        }

        # Load existing problem statements texts to avoid duplicates
        existing_problems = storage.get_existing_problem_texts()

        # Generate problem statements using AI
        generated_statements = problem_generator.generate_problem_statements(theme, [], existing_problems, max_ideas=3)

        # Append generated ideas in generated_ideas.json with unique ids and session handling
        storage.append_generated_ideas("Hackathon", theme["name"], generated_statements, session_id, file_path=generated_ideas_path)

        # Add generated ideas to problem_statements.json
        storage.add_problem_statements(theme["name"], generated_statements, file_path=problem_statements_path)

        # Append generated ideas in generated_ideas.json with unique ids and session handling
        appended_count = storage.append_generated_ideas("Hackathon", theme["name"], generated_statements, session_id, file_path=generated_ideas_path)

        # Add generated ideas to problem_statements.json
        storage.add_problem_statements(theme["name"], generated_statements, file_path=problem_statements_path)

        # Load updated generated_ideas.json to get all ideas for this session
        with open(generated_ideas_path, 'r') as f:
            generated_data = json.load(f)

        # Get the last appended ideas based on appended_count
        all_ideas = generated_data.get("generated_ideas", [])
        last_ideas = all_ideas[-appended_count:] if appended_count > 0 else []

        # Prepare response data with consistent unique ids for newly added ideas
        response_ideas = []
        for idea in last_ideas:
            response_ideas.append({
                "id": idea["id"],
                "theme": idea.get("topic", ""),
                "title": idea["text"][:50],  # Use first 50 chars as title
                "text": idea["text"]
            })

        return Response({"session_id": session_id, "ideas": response_ideas}, status=200)
