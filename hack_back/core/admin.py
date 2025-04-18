from django.contrib import admin
from .models import (
    HackathonSession,
    ThemeSelection,
    Idea,
    ChatMessage,
    ReadmeSession,
    PitchHelperSession,
)

# Register your models here.

admin.site.register(HackathonSession)
admin.site.register(ThemeSelection)
admin.site.register(Idea)
admin.site.register(ChatMessage)
admin.site.register(ReadmeSession)
admin.site.register(PitchHelperSession)
