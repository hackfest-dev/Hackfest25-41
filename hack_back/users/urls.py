from django.urls import path
from .views import RegisterAPIView, LoginAPIView, ValidateUserAPIView, LogoutAPIView


urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('validate-user/<str:username>/', ValidateUserAPIView.as_view(), name='validate-user'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
]