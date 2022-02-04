from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView


from .models import Story, Category
from .serializers import *


class StoryListView(generics.ListAPIView):
    queryset = Story.objects.all()
    serializer_class = StoryListSerializer
    
    
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    
class StoryDetailView(generics.RetrieveAPIView):
    serializer_class = StoryDetailSerializer
    lookup_field = 'url'
    queryset = Story.objects.all()
    
class StoryListByCategoryView(generics.ListAPIView):
    serializer_class = StoryListSerializer
    
    def get_queryset(self):
        return Story.objects.filter(category__url=self.kwargs['url'])