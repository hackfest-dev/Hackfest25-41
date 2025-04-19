from django.urls import path

urlpatterns = [
    path('generate/', GenerateReadmeAPIView.as_view(), name='generate-readme'),
    path('readme-sessions/', ReadmeSessionListAPIView.as_view(), name='readme-session-list'),
]