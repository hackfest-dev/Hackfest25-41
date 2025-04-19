from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from core.scripts.auto_readme_parallel import generate_readme_for_repo
from urllib.parse import urlparse
from readme.models import ReadmeSession
import os

class GenerateReadmeAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        repo_link = request.data.get('repo_link')
        if not repo_link:
            return Response({"error": "repo_link is required in the request body."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if GITHUB_TOKEN is set
        # if not os.getenv('GITHUB_TOKEN'):
        #     return Response({"error": "GITHUB_TOKEN environment variable is not set."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Parse the repo link to extract owner and repo name
        try:
            parsed_url = urlparse(repo_link)
            path_parts = parsed_url.path.strip('/').split('/')
            if len(path_parts) < 2:
                return Response({"error": "Invalid GitHub repository URL."}, status=status.HTTP_400_BAD_REQUEST)
            repo_owner = path_parts[0]
            repo_name = path_parts[1]
        except Exception:
            return Response({"error": "Invalid repo_link format."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            readme_content = generate_readme_for_repo(repo_owner, repo_name)
            ReadmeSession.objects.create(
                session=None,  # Assuming session is not used here
                user=request.user,
                github_repo_link=repo_link,
                repo_summary="",
                generated_readme=readme_content
            )
            return Response({"readme": readme_content, "message": "Readme generated successfully.", "readme_session_id": ReadmeSession.objects.last().id}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ReadmeSessionListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        pass
