from allauth.account.adapter import DefaultAccountAdapter
from django.shortcuts import resolve_url

class MyAccountAdapter(DefaultAccountAdapter):
    def get_login_redirect_url(self, request):
        user = request.user
        if user.is_authenticated and user.date_joined == user.last_login:
            return resolve_url("/api/registration/")
        return resolve_url("/api/home/")
