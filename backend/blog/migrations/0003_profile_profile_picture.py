# Generated by Django 4.0.1 on 2022-01-11 15:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_category_story'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='profile_picture',
            field=models.ImageField(blank=True, null=True, upload_to='users/%y.%m.%d', verbose_name='Фотография'),
        ),
    ]
