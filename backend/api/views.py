from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login , logout
from .models import CareerGoal,GeminiResponse
from django.contrib.auth.hashers import make_password
from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash
from .gemini_api import get_gemini_response
from .utils import extract_text_from_resume, extract_skills_from_text
import re


def landing(request):
    if request.user.is_authenticated:
        return redirect('home')
    return render(request, 'landing.html')




def signin(request):
    if request.user.is_authenticated:
        return redirect('home')

    if request.method == "POST":
        name = request.POST.get("check")

        if name == "old_user":
            username = request.POST.get('username')
            password = request.POST.get('password')
            user = authenticate(request, username=username, password=password)

            if user is not None:
                user.backend = 'django.contrib.auth.backends.ModelBackend'  
                login(request, user)
                return redirect('home')
            else:
                messages.error(request, "Username or password does not exist")

        else: 
            username = request.POST.get('username')
            password = request.POST.get('password')
            confirm_password = request.POST.get('password2')
            email = request.POST.get('email')

            password_regex = re.compile(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$')

            if password != confirm_password:
                messages.error(request, "Passwords do not match.")
            elif User.objects.filter(username=username).exists():
                messages.error(request, "User already exists.")
            elif not password_regex.match(password):
                messages.error(request, "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.")
            else:
                user = User.objects.create(
                    username=username,
                    password=make_password(password),
                    first_name=username,
                    email=email
                )
                user.save()
                user.backend = 'django.contrib.auth.backends.ModelBackend'  
                login(request, user)
                return redirect('registration')

    return render(request, 'login.html')


@login_required
def home(request):
    username = request.user.username

    if request.method == 'POST':
        job = request.POST.get('job-dropdown')
        
        try:
            exist = GeminiResponse.objects.get(user__username=username,field = job)
            gemini_response = exist.response  
            print(exist)
        except GeminiResponse.DoesNotExist:
            try:
                user_profile = CareerGoal.objects.get(user__username=username)
                entered_skills = user_profile.technical_skills or ""
            except CareerGoal.DoesNotExist:
                entered_skills = ""
                user_profile = CareerGoal(user=request.user, technical_skills="no skill yet")

            resume_text = ""
            if 'resume-upload' in request.FILES:
                resume_file = request.FILES['resume-upload']
                resume_text = extract_text_from_resume(resume_file)

            all_skills = entered_skills  
            if resume_text:
                extracted_skills = extract_skills_from_text(resume_text)
                all_skills += ", " + ", ".join(extracted_skills)  

            user_profile.technical_skills = all_skills
            user_profile.save()

            input_text = f"""I have the skills: {all_skills} and i want the job {job}. 
            give me a mark down of the required skills i am missing just give me the mark down alone like #for main branch and ## for second and ### for 3rd remember give me only markdown only '#' are allowed before every subtopic or topic.
            make sure not to include ``` at the starting or at the end"""
            gemini_response = get_gemini_response(input_text)

            GeminiResponse.objects.create(user=request.user, response=gemini_response,field = job)
            print(gemini_response)
        return render(request, 'roadmap.html', {'gemini_response': gemini_response})

    return render(request, 'home.html')

@login_required
def registration(request):
    if request.method == 'POST':
        check = request.POST.get('check')
        career_goal, created = CareerGoal.objects.get_or_create(user=request.user)

        if check == 'resume':
            resume_file = request.FILES.get('resume-upload')
            if resume_file:
                career_goal.resume = resume_file
                resume_text = extract_text_from_resume(resume_file)
                extracted_skills = extract_skills_from_text(resume_text)
                if extracted_skills:
                    career_goal.technical_skills = (
                        career_goal.technical_skills or ""
                    ) + ", " + ", ".join(extracted_skills)

        elif check == 'text': 
            career_goal.current_job_title = request.POST.get('current-job-title')
            career_goal.education = request.POST.get('education')
            career_goal.education_field = request.POST.get('education-field')
            career_goal.graduation_year = request.POST.get('graduation-year')
            career_goal.technical_skills = request.POST.get('technical-skills')
            career_goal.soft_skills = request.POST.get('soft-skills')
            career_goal.experience_job_title = request.POST.get('experience-job-title')
            career_goal.experience_duration = request.POST.get('experience-duration')

        career_goal.save()
        return redirect('home')

    return render(request, 'register.html')


@login_required
def setting(request):
    if request.method == 'POST':
        form_type = request.POST.get('form_type')

        if form_type == 'profile_info':
            first_name = request.POST.get('first-name')
            last_name = request.POST.get('last-name')
            username = request.POST.get('username')
            email = request.POST.get('email')
            
            request.user.first_name = first_name
            request.user.last_name = last_name
            request.user.username = username
            request.user.email = email
            request.user.save()
            
            messages.success(request, 'Profile info updated successfully!')

        elif form_type == 'password_change':
            current_password = request.POST.get('current-password')
            new_password = request.POST.get('new-password')
            confirm_password = request.POST.get('confirm-password')

            if not request.user.check_password(current_password):
                messages.error(request, 'Current password is incorrect.')
                return redirect('setting')

            if new_password != confirm_password:
                messages.error(request, 'Passwords do not match.')
                return redirect('setting')
            request.user.set_password(new_password)
            request.user.save()
            update_session_auth_hash(request, request.user)

            messages.success(request, 'Password updated successfully!')

        return redirect('setting')
    context = {
        'user': request.user,
    }
    return render(request, 'settings.html', context)

from django.views.generic import TemplateView

class TestView(TemplateView):
    template_name = 'test.html'

def singout(request):
    logout(request)
    return redirect('landing')

def error404(request, exception):
    return render(request, '404.html', status=404)
