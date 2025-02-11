from django.contrib import admin
from .models import CareerGoal,GeminiResponse

class CareerGoalAdmin(admin.ModelAdmin):
    list_display = ('user', 'current_job_title', 'goal_job_title', 'education', 'availability','resume')
    search_fields = ('user__username', 'goal_job_title', 'current_job_title', 'education','resume')


class GeminiResponseAdmin(admin.ModelAdmin):
    list_display = ('user', 'response')
    search_fields = ('user__username', 'response')

admin.site.register(CareerGoal, CareerGoalAdmin)
admin.site.register(GeminiResponse, GeminiResponseAdmin)