from rest_framework import serializers
from .models import Category, Profile, Story


class CategorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Category
        fields = "__all__" 

class CreatorSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Profile
        fields = ("username", )


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
        exclude = ('draft', 'url', )

class ProfileDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ("username", "profile_picture", "profile_url", "status", )