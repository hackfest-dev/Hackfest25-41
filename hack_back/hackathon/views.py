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
# Create your views here.

class CreateHackathonView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    #recieve the pdf or plain text and send it to ai
    def post(self, request):
        """
        Handle file upload and OCR processing
        Steps:
        1. Process text message if present
        2. Process file if uploaded
        3. Create chat messages and broadcast
        """
        pass