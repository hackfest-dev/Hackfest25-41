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

# Create your views here.

# Initialize logger
logger = logging.getLogger(__name__)

class CreateHackathonView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    #recieve the pdf or plain text and send it to ai
    pass