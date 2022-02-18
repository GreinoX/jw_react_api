from rest_framework.response import Response
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

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


class ProfileDetailView(generics.RetrieveAPIView):
    serializer_class = ProfileDetailSerializer
    lookup_field = 'username'
    queryset = Profile.objects.all()
    # permission_classes = [permissions.IsAuthenticated, ]

class ProfileForUpdateView(generics.RetrieveAPIView):
    serializer_class = ProfileEditSerializer
    lookup_field = 'username'
    queryset = Profile.objects.all()


class StoryListByProfileView(generics.ListAPIView):
    serializer_class = StoryListSerializer

    def get_queryset(self):
        return Story.objects.filter(creator__username=self.kwargs['username'])

    
class StoryCreateView(APIView):
    # permission_classes = [permissions.IsAuthenticated, ]
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request):
        serializer = StoryCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
class ProfileUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    queryset = Profile.objects.all()
    serializer_class = ProfileEditSerializer
    lookup_field = 'id'

class StoryUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    queryset = Story.objects.all()
    serializer_class = StoryUpdateSerializer
    lookup_field = 'id'
    
class StoryDestroyView(generics.DestroyAPIView):
    serializer_class = StoryUpdateSerializer
    queryset = Story.objects.all()
    lookup_field = 'id'
    # permission_classes = [permissions.IsAuthenticated, ]