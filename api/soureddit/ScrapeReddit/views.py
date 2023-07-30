import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Subreddits

@csrf_exempt
def add_subreddits(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            for subreddit_name in data:
                subreddit, created = Subreddits.objects.get_or_create(name=subreddit_name)
                if not created:
                    subreddit.count += 1
                    subreddit.save()

            return JsonResponse({"message": "Subreddit counts updated successfully."})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)

    return JsonResponse({"error": "This endpoint only accepts POST requests."}, status=405)


@csrf_exempt
def delete_subreddits(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            for subreddit_name in data:
                try:
                    subreddit = Subreddits.objects.get(name=subreddit_name)
                    if subreddit.count > 0:
                        subreddit.count -= 1
                        subreddit.save()

                        if subreddit.count == 0:
                            subreddit.delete()
                except Subreddits.DoesNotExist:
                    pass

            return JsonResponse({"message": "Subreddit counts reduced successfully."})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)

    return JsonResponse({"error": "This endpoint only accepts POST requests."}, status=405)
