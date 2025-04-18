from django.db import models
from django.contrib.auth.models import User
from hackathon.models import HackathonSession

# Create your models here.

# Readme Generation
class ReadmeSession(models.Model):
    session = models.ForeignKey(HackathonSession, on_delete=models.SET_NULL, null=True, blank=True, related_name='readme_sessions')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    github_repo_link = models.URLField()
    repo_summary = models.TextField(null=True, blank=True)
    generated_readme = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.github_repo_link[19:]}"