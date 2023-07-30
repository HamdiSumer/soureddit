from django.urls import path
from . import views

urlpatterns = [
    path('add_subreddits/', views.add_subreddits, name='add_subreddits'),
    path('delete_subreddits/', views.delete_subreddits, name='delete_subreddits'),
]
