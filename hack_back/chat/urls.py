from django.urls import path
from django.urls import include
from .views import MessageAPIView, MessageListAPIView, AIChatAPIView

urlpatterns = [
    path('messages/', MessageAPIView.as_view(), name='messages'),
    path('messages/list/', MessageListAPIView.as_view(), name='message-list'),
    path('ai-chat/', AIChatAPIView.as_view(), name='ai-chat'),
]
