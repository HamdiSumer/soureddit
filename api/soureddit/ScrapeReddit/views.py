import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Subreddits
from django.core.exceptions import ObjectDoesNotExist


@csrf_exempt
def add_subreddits(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            if data['old_pref']:
                # User requested new subreddits
                old_pref = set(data['old_pref'])
                curr_pref = set(data['curr_pref'])

                subreddits_to_add = list(curr_pref - old_pref)
                subreddits_to_remove = list(old_pref - curr_pref)

                if len(subreddits_to_add) != 0:
                    for sub in subreddits_to_add:
                        try:
                            count = Subreddits.objects.get(subreddit=sub).count
                            Subreddits.objects.filter(subreddit=sub).update(count=count + 1)
                        except ObjectDoesNotExist:
                            Subreddits(subreddit=sub, count=1).save()

                if len(subreddits_to_remove) != 0:
                    for sub in subreddits_to_remove:
                        count = Subreddits.objects.get(subreddit=sub).count
                        if count != 1:
                            Subreddits.objects.filter(subreddit=sub).update(count=count - 1)
                        else:
                            Subreddits.objects.filter(subreddit=sub).delete()
            else:
                for subreddit_name in data['curr_pref']:
                    try:
                        count = Subreddits.objects.get(subreddit=subreddit_name).count
                        Subreddits.objects.filter(subreddit=subreddit_name).update(count=count+1)
                    except ObjectDoesNotExist:
                        Subreddits(subreddit=subreddit_name, count=1).save()

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
