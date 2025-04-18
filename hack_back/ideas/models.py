from django.db import models
from django.contrib.auth.models import User
from hack_back.hackathon.models import HackathonSession


# Create your models here.


# Idea Suggestions
class Idea(models.Model):
    session = models.ForeignKey(HackathonSession, on_delete=models.SET_NULL, null=True, blank=True, related_name='ideas')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    accepted = models.BooleanField(default=False)
    finalised = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}{self.content[:20]} - {self.accepted} - {self.finalised}"