from django.db import models
from django.contrib.auth.models import User
from hackathon.models import HackathonSession

# Create your models here.


# Chat with AI
class ChatMessage(models.Model):
    session = models.ForeignKey(HackathonSession, on_delete=models.SET_NULL, null=True, blank=True, related_name='chats')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sender = models.CharField(max_length=10, choices=[('user', 'User'), ('ai', 'AI')])
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.sender}"