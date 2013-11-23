from django.shortcuts import render, redirect
from django.conf import settings
from django.contrib.auth import authenticate, login
from daspi.apps.checkins.models import Place

def home(request):
    """Login and/or eventual redirect"""

    if not request.user.is_authenticated():
        return redirect('login')

    # detect what options to show here: reporting or checkin
    if request.user.applepiuser.can_report():
        return redirect('reports')

    return

def dologin(request):
    if request.POST.get('user', None) and request.POST.get('pass', None):
        user = authenticate(username=request.POST.get('user'),
                            password=request.POST.get('pass'))
        if user is not None:
            # login and redirect
            login(request, user)
            return redirect('home')

    return render(request, 'login.html', {'location': _get_location()})

def reports(request):
    """The reporting module - see where your bastard is"""

    return

def _get_location():
    """Small info about the current location"""

    return Place.objects.get(pk=settings.THIS_PLACE_PK)
