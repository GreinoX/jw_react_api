from calendar import c
from rest_framework import serializers
from .models import Category, Profile, ProfileStoryRelation, Story


class CategorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Category
        fields = "__all__" 

class CreatorSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Profile
        fields = ("id", "username", )


class StoryListSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    
    class Meta:
        model = Story
        fields = ('id', 'title', 'shortinfo', 'category', 'rating', 'views', 'url', 'image')  


class StoryDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    creator = CreatorSerializer()
    
    class Meta:
        model = Story
        exclude = ('draft',)

class StoryUpdateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Story
        fields = ('id', 'title', 'shortinfo', 'category', 'creator', 'text', 'image')

class StoryCreateSerializer(serializers.ModelSerializer):
    
    def create(self, validated_data):
        return Story.objects.create(**validated_data)
    
    class Meta:
        model = Story
        fields = ('title', 'shortinfo', 'image', 'category', 'creator')

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
        fields = ("user", "story", "is_liked", )

class StoryLikesSerializer(serializers.ModelSerializer):

    class Meta:
        fields = ('id', )