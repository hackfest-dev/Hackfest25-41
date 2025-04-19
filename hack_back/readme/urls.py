from django.urls import path
from .views import GenerateReadmeAPIView, ReadmeSessionListAPIView

urlpatterns = [
    path('generate/', GenerateReadmeAPIView.as_view(), name='generate-readme'),
    path('readme-sessions/', ReadmeSessionListAPIView.as_view(), name='readme-session-list'),
]