from django.db import models
from django.conf import settings
from datetime import date
from django.urls import reverse
from ckeditor.fields import RichTextField
from pytils.translit import slugify
from django.contrib.auth.models import AbstractUser
import string
import random


def get_random_string_for_url(length):
    letters = string.ascii_lowercase + string.ascii_uppercase
    random_string = ''.join(random.choice(letters) for i in range(length))
    return random_string

STATUS = [
    ('reviewer', 'Критик'),
    ('writer', 'Писатель'),
    ('on_right_way', 'На пути истинном'),
    ('junior_poet', 'Юный поэт'),
]


class Profile(AbstractUser):
    status = models.CharField("Статус", max_length=40, null=True, blank=True, choices=STATUS, default='on_right_way')
    profile_picture = models.ImageField("Фотография", upload_to="users/%y.%m.%d", null=True, blank=True)
    profile_url = models.SlugField("Личная ссылка", max_length=150, null=True, unique=True)
    profile_rating = models.SmallIntegerField("Рейтинг", null=True, default=0)
    
    def get_absolute_url(self, *args, **kwargs):
        return reverse("profile-index", kwargs={"slug": self.profile_url})
    
    def get_absolute_edit_url(self, *args, **kwargs):
        return reverse("profile-edit", kwargs={"slug": self.profile_url})
    
    def get_profile_picture(self, *args, **kwargs):
        if self.profile_picture:
            return self.profile_picture.url
        return settings.MEDIA_URL + "users/default.png"
    
    def save(self, *args, **kwargs):
        self.profile_url = self.username
        super(Profile, self).save(*args, **kwargs)

class Category(models.Model):
    title = models.CharField("Название", max_length=150)
    url = models.SlugField("Личная ссылка")
    
    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse("stories-list-by-category", kwargs={"slug": self.url})
    
    
    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"


class Story(models.Model):
    title = models.CharField("Название", max_length=150)
    text = RichTextField(null=True, blank=True)
    shortinfo = models.CharField("Слоган", max_length=150, blank=True)
    image = models.ImageField("Постер", upload_to="stories/%y.%m.%d", null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name="Категория")
    draft = models.BooleanField("Черновик", default=False)
    published = models.DateField("Опубликованно", default=date.today)
    rating = models.SmallIntegerField("Рейтинг", null=True, default=0)
    views = models.SmallIntegerField("Просмотры", null=True, default=0)
    url = models.SlugField("Личная ссылка", unique=True)
    creator = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="creator_stories", null=True)
    # readers = models.ManyToManyField(Profile, through='ProfileStoryRelation', related_name="readers_stories")
    
    
    def formatted_views(self):
        if self.views > 1000000:
            return str(self.views // 1000000) + "M"
        elif self.views > 1000:
            return str(self.views // 1000) + "K"
        else:
            return str(self.views)
    
    def formatted_rating(self):
        if self.rating > 1000000:
                return str(self.rating // 1000000) + "M"
        elif self.rating > 1000:
            return str(self.rating // 1000) + "K"
        else:
            return str(self.rating)
        
    def formatted_v_full(self):
        formatted = "{:,}".format(self.views).replace(",", " ")
        return formatted
    
    def formatted_r_full(self):
        formatted = "{:,}".format(self.rating).replace(",", " ")
        return formatted
    
    def __str__(self):
        return f"<Story>: {self.title}"
    
    def get_absolute_url(self):
        return reverse("story-detail-view", kwargs={"slug": self.url})
    
    def save(self, *args, **kwargs):
        self.url = slugify(self.title[0:120] + get_random_string_for_url(30))
        super(Story, self).save(*args, **kwargs)
        
    
    class Meta:
        ordering = ["-published", "-rating"]
        verbose_name = "Рассказ"
        verbose_name_plural = "Рассказы"
        
class ProfileStoryRelation(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE, verbose_name="Пользователь")
    story = models.ForeignKey(Story, on_delete=models.CASCADE, verbose_name="История")
    is_liked = models.BooleanField("Лайк", default=False)
    in_bookmarks = models.BooleanField("В закладках", default=False)
    
    def __str__(self):
        return f'Profile: {self.user.username} -> {self.story}'
    
    class Meta:
        verbose_name = "Лайки и закладки"
        verbose_name_plural = "Лайки и закладки"