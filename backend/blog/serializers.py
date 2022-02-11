from calendar import c
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
        