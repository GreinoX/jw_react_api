from django.urls import path
from django.contrib.auth.views import LogoutView

from .views import *


urlpatterns = [
    path('', StoryListView.as_view(), name='story-index'),
    path('story/<slug:url>', StoryDetailView.as_view(), name='story-detail'),
    path('categories/', CategoryListView.as_view(), name='categories-list'),
    path('category/<slug:url>', StoryListByCategoryView.as_view(), name='story-list-by-category-view'),
]
