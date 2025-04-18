from django.urls import path
from django.urls import include
from .views import CreateHackathonView, AddThemesView

urlpatterns = [
    path('create/', CreateHackathonView.as_view(), name='create_hackathon'),
    path('themes/<int:session_id>/add/', AddThemesView.as_view(), name='add_themes'),
]