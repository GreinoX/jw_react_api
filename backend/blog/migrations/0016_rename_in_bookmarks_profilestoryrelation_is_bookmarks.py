# Generated by Django 4.0.2 on 2022-02-26 12:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0015_alter_story_url'),
    ]

    operations = [
        migrations.RenameField(
            model_name='profilestoryrelation',
            old_name='in_bookmarks',
            new_name='is_bookmarks',
        ),
    ]