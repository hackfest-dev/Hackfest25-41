from django.urls import path
from django.urls import include
from .views import GenerateIdeasView

urlpatterns = [
    path('<int:session_id>/generate/', GenerateIdeasView.as_view(), name='generate_idea'),
]