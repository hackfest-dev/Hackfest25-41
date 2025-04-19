from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from core.scripts.auto_readme_parallel import generate_readme_for_repo
from urllib.parse import urlparse
import json
from .models import PitchHelperSession
import os

# Create your views here.

from rest_framework import status
from rest_framework.response import Response
from readme.models import ReadmeSession
from core.pitch_engine.pitchgen import generate_pitch_from_readme

class GeneratePitchView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        readme_session_id = request.data.get("readme_session_id")
        if not readme_session_id:
            return Response({"error": "readme_session_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            readme_session = ReadmeSession.objects.get(id=readme_session_id)
        except ReadmeSession.DoesNotExist:
            return Response({"error": "ReadmeSession not found"}, status=status.HTTP_404_NOT_FOUND)

        readme_content = readme_session.generated_readme
        if not readme_content:
            return Response({"error": "Readme content not found for the given session"}, status=status.HTTP_404_NOT_FOUND)

        pitch_data = generate_pitch_from_readme(readme_content)
        if not pitch_data:
            return Response({"error": "Failed to generate pitch"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        PitchHelperSession.objects.create(
            session=readme_session.session,
            user=request.user,
            pitch_text=pitch_data,
            key_questions=pitch_data.get("key_questions", "")
        )
        return Response(pitch_data, status=status.HTTP_200_OK)
