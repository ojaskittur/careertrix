# Generated by Django 5.1.1 on 2024-09-26 05:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_careergoal_resume_profile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='careergoal',
            name='resume',
            field=models.BinaryField(blank=True, null=True),
        ),
        migrations.DeleteModel(
            name='Profile',
        ),
    ]
