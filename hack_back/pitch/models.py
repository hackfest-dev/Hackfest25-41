from django.db import models
from django.contrib.auth.models import User
from hackathon.models import HackathonSession

# Create your models here.


# Pitch Helper
class PitchHelperSession(models.Model):
    session = models.ForeignKey(HackathonSession, on_delete=models.SET_NULL, null=True, blank=True, related_name='pitch_sessions')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    pitch_text = models.TextField()
    key_questions = models.TextField(help_text="Store as plain text or JSON")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.pitch_text[:20]}"