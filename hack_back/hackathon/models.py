from django.db import models
from django.contrib.auth.models import User

# Create your models here.


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

    def __str__(self):
        return f"{self.theme_name}"
