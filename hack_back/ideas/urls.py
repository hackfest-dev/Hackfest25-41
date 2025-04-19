from django.urls import path
from django.urls import include
from .views import GenerateIdeasView, FinalizeIdeaView

urlpatterns = [
    path('<int:session_id>/generate/', GenerateIdeasView.as_view(), name='generate_idea'),
    path('<int:session_id>/<int:idea_id>/final/', FinalizeIdeaView.as_view(), name='finalize_idea'),
]