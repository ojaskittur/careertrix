from allauth.account.adapter import DefaultAccountAdapter
from django.shortcuts import resolve_url
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.core.exceptions import ValidationError

class MySocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        if sociallogin.is_existing:
            return

        user = sociallogin.user
        if not user.email:
            raise ValidationError("No email associated with this account.")

        from django.contrib.auth import get_user_model
        User = get_user_model()

        try:
            existing_user = User.objects.get(email=user.email)
            sociallogin.connect(request, existing_user)
        except User.DoesNotExist:
            pass 

class MyAccountAdapter(DefaultAccountAdapter):
    def get_login_redirect_url(self, request):
        user = request.user
        if user.is_authenticated and user.date_joined == user.last_login:
            return resolve_url("/v1/registration/")
        return resolve_url("/v1/home/")
