from django.urls import path

from .views import homePageView,homePageView2

urlpatterns = [
    path("", homePageView, name="home"),
    path("test/", homePageView2, name="home2")
]