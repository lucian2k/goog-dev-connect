from django.shortcuts import render, redirect
from django.conf import settings
from django.contrib.auth import authenticate, login, logout

from daspi.apps.checkins.models import Place, ApplePiUser, Checkin

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

    if not request.user.is_authenticated(): return redirect('home')

    # get the status of all the people being followed
    stalking = ApplePiUser.objects.filter(parent=request.user.pk)
    checkins = Checkin.objects.filter(user__in=stalking).order_by('-starttime', '-endtime')

    return render(request,
                    'reports.html',
                    {'location': _get_location(),
                    'checkins': checkins,
                    'stalking_count': len(stalking)})

def _get_location():
    """Small info about the current location"""

    return Place.objects.get(pk=settings.THIS_PLACE_PK)

def dologout(request):
    logout(request)
    return redirect('home')