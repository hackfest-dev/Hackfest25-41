from django.urls import path
from django.urls import include

urlpatterns = [
    path('auth/', include('users.urls') ),
    path('session/',include('hackathon.urls')),
    path('ideas/',include('ideas.urls')),
#     path('chat/',include('chat.urls')),
#     path('readme/',include('readme.urls')),
#     path('pitch/',include('pitch.urls')),

]