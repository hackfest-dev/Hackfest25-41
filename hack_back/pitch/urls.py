from django.urls import path
from .views import GeneratePitchView

urlpatterns = [
    path('generate/', GeneratePitchView.as_view(), name='generate_pitch'),
]