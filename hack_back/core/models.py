from django.contrib.auth.models import User
from django.db import models


# Main Session Per Hackathon or Project
class HackathonSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    title = models.CharField(max_length=255, help_text="Name this session (e.g. SIH 2025)")
    brochure = models.FileField(upload_to='brochures/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.title}"

# Themes selected by user
class ThemeSelection(models.Model):
    session = models.ForeignKey(HackathonSession, on_delete=models.CASCADE, related_name='themes')
    theme_name = models.CharField(max_length=255)

# Idea Suggestions
class Idea(models.Model):
    session = models.ForeignKey(HackathonSession, on_delete=models.SET_NULL, null=True, blank=True, related_name='ideas')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    accepted = models.BooleanField(default=False)
    finalised = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

# Chat with AI
class ChatMessage(models.Model):
    session = models.ForeignKey(HackathonSession, on_delete=models.SET_NULL, null=True, blank=True, related_name='chats')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sender = models.CharField(max_length=10, choices=[('user', 'User'), ('ai', 'AI')])
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

# Readme Generation
class ReadmeSession(models.Model):
    session = models.ForeignKey(HackathonSession, on_delete=models.SET_NULL, null=True, blank=True, related_name='readme_sessions')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    github_repo_link = models.URLField()
    repo_summary = models.TextField(null=True, blank=True)
    generated_readme = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

# Pitch Helper
class PitchHelperSession(models.Model):
    session = models.ForeignKey(HackathonSession, on_delete=models.SET_NULL, null=True, blank=True, related_name='pitch_sessions')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    pitch_text = models.TextField()
    key_questions = models.TextField(help_text="Store as plain text or JSON")
    created_at = models.DateTimeField(auto_now_add=True)
