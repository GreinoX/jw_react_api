from rest_framework import pagination

class StoryListPagination(pagination.PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    page_query_param = "p"