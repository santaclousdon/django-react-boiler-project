# Generated by Django 4.2.7 on 2024-01-08 01:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0003_savedmarket_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='savedmarket',
            name='gid',
        ),
        migrations.RemoveField(
            model_name='savedmarket',
            name='name',
        ),
        migrations.RemoveField(
            model_name='savedmarket',
            name='type',
        ),
        migrations.AddField(
            model_name='savedmarket',
            name='region',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='markets', to='home.region'),
        ),
    ]
