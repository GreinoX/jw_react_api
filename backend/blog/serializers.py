from calendar import c
from rest_framework import serializers
from .models import Category, Profile, ProfileStoryRelation, Story


class CategorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Category
        fields = "__all__" 

class CreatorSerializer(serializers.ModelSerializer):
    status = serializers.CharField(source="get_status_display")
    
    class Meta:
        model = Profile
        fields = ("id", "username", "profile_picture", "status", "first_name", "last_name")


class StoryListSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    rating = serializers.CharField(source='get_likes')
    views = serializers.CharField(source='get_views')
    
    class Meta:
        model = Story
        fields = ('id', 'title', 'shortinfo', 'category', 'rating', 'views', 'url', 'image')  


class StoryDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    creator = CreatorSerializer()
    rating = serializers.CharField(source='get_likes')
    views = serializers.CharField(source='get_views')
    
    class Meta:
        model = Story
        exclude = ('draft',)

class StoryUpdateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Story
        fields = ('id', 'title', 'shortinfo', 'category', 'creator', 'text', 'image', 'rating')

class StoryCreateSerializer(serializers.ModelSerializer):
    
    def create(self, validated_data):
        return Story.objects.create(**validated_data)
    
    class Meta:
        model = Story
        fields = ('title', 'shortinfo', "text", 'image', 'category', 'creator', 'url')

class ProfileDetailSerializer(serializers.ModelSerializer):
    status = serializers.CharField(source='get_status_display')

    class Meta:
        model = Profile
        fields = ("id", "first_name", "last_name", "username", "profile_picture", "status", )
        
class ProfileEditSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ("id", "first_name", "last_name", "profile_picture", "status", )
        
class ProfileStoryRelationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all())
    story = serializers.PrimaryKeyRelatedField(queryset=Story.objects.all())

    class Meta:
        model = ProfileStoryRelation
        fields = ("user", "story", "is_liked", "is_bookmarks")

class ProfileStoryRelationBookmarksSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all())
    story = StoryListSerializer()

    class Meta:
        model = ProfileStoryRelation
        fields = ("user", "story", "is_liked", "is_bookmarks")

class StoryLikesSerializer(serializers.ModelSerializer):

    class Meta:
        fields = ('id', )