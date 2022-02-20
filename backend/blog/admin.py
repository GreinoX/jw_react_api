from django.contrib import admin
from .models import Category, Story, Profile, ProfileStoryRelation
from django.contrib.auth.admin import UserAdmin

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'url', )
    list_display_links = ('title', )
    
@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'draft')
    list_display_links = ('title', )

@admin.register(ProfileStoryRelation)
class ProfileStoryRelationAdmin(admin.ModelAdmin):
    pass

class ProfileUserAdmin(UserAdmin):
    model = Profile
    list_display = ['username']
    fieldsets = UserAdmin.fieldsets + (
            ('Доп. Информация', {'fields': ('status', 'profile_picture', 'profile_rating')}),
    )

    
admin.site.register(Profile, ProfileUserAdmin)

admin.site.site_title = 'Просто Пиши'
admin.site.site_header = 'Просто Пиши'