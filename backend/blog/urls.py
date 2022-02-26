from django.urls import path
from django.contrib.auth.views import LogoutView

from .views import *


urlpatterns = [
    path('', StoryListView.as_view(), name='story-index'),
    path('story/<slug:url>', StoryDetailView.as_view(), name='story-detail'),
    path('categories/', CategoryListView.as_view(), name='categories-list'),
    path('category/<slug:url>', StoryListByCategoryView.as_view(), name='story-list-by-category-view'),
    path('profileData/<username>', ProfileDetailView.as_view()),
    path('profileData/edit/<username>', ProfileForUpdateView.as_view()),
    path('profileStories/<username>', StoryListByProfileView.as_view()),
    path('story/create/', StoryCreateView.as_view()),
    path('story/update/<int:id>', StoryUpdateView.as_view()),
    path('story/destroy/<int:id>', StoryDestroyView.as_view(), name=""),
    path('story/likes/<int:id>', StoryUpdateRatingView.as_view(), name=""),
    path('story/search/<search_value>', StoryListBySearchView.as_view()),
    path('profile/edit/<int:id>', ProfileUpdateView.as_view()),
    path('profileStoryRelation/<int:user_id>/<int:story_id>', ProfileStoryRelationView.as_view()),
    path('profileStoryRelation/update/<int:user_id>/<int:story_id>', ProfileStoryRelationUpdateView.as_view()),
]
