from django.urls import path
from . import views

urlpatterns = [
    path('add_subreddits/', views.add_subreddits, name='add_subreddits'),
    path('summarized_data/', views.summarized_data, name='summarized_data'),
]
