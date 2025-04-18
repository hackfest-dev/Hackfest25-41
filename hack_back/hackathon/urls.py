from django.urls import path
from django.urls import include
from .views import CreateHackathonView

urlpatterns = [
    path('create/', CreateHackathonView.as_view(), name='create_hackathon'),
]