# Generated by Django 4.2.7 on 2024-01-18 20:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='beta',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='lia_member',
            field=models.BooleanField(default=False),
        ),
    ]