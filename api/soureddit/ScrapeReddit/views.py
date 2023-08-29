import json
from django.views.decorators.csrf import csrf_exempt
from .models import Subreddits
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from cassandra.cluster import Cluster
from cassandra.query import dict_factory

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
def summarized_data(request) -> json:
    """
    This function returns the filtered data according to sent request from cassandra in json format.
    """
    if request.method == "GET":
        try:
            requested_subreddits = request.GET.getlist('subreddit')

            # Connect to the Cassandra database
            cluster = Cluster(['localhost'])
            session = cluster.connect('soureddit')

            data_set = []

            for subreddit in requested_subreddits:
                # Build your query to filter data based on subreddits
                query = f"SELECT * FROM reddit_posts WHERE subreddit = '{subreddit}'"
                prepared_query = session.prepare(query)

                # change returned rows format to dictionary
                session.row_factory = dict_factory

                # Execute the query with the provided subreddits
                result_set = session.execute(prepared_query)

                # Convert the result set to a list of dictionaries or any format you prefer
                filtered_data = [row for row in result_set]

                data_set.extend(filtered_data)

            # Close the Cassandra connection
            session.shutdown()

            for i in data_set:
                if i['body'] is not None:
                    i['body'] = i['body'].decode('utf-8')
                if i['comments'] is not None:
                    i['comments'] = i['comments'].decode('utf-8')

            # Return the filtered data as JSON response
            return JsonResponse(data_set, safe=False)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)

    return JsonResponse({"error": "This endpoint only accepts POST requests."}, status=405)