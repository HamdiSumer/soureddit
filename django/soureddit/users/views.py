from django.http import HttpResponse
from django.shortcuts import redirect


def homePageView(request):

    print('hello')

    return HttpResponse("Hello, World! TUGRUL")


def homePageView2(request):
    return redirect("http://localhost:3000/")