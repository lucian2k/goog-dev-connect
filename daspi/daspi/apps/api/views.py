from django.shortcuts import render
from django.contrib.auth import authenticate, login

from daspi.apps.checkins.models import Place, UserTokens, Checkin
from decorators import json_response
from django.conf import settings

@json_response
def dologin(request):
    token = None

    if request.POST.get('user', None) and request.POST.get('pass', None):
        user = authenticate(username=request.POST.get('user'),
                            password=request.POST.get('pass'))
        if user is not None:
            # generate the key and return it
            try: token = user.usertokens_set.all().order_by('-pk')[0].value
            except: pass

            # just create the damn token
            if not token: token = user.applepiuser.generate_token()

    return {'token': token}

@json_response
def location(request):
    return Place.objects.get(pk=settings.THIS_PLACE_PK).to_json()

@json_response
def checkin(request):
    token = request.GET.get('token', None)
    # token = request.POST.get('token', None)

    try: token_obj = UserTokens.objects.get(value=token)
    except: token_obj = None

    if not token_obj: return {'error': 'Invalid token', 'success': False}

    # find the user and register the checkin
    place_obj   = Place.objects.get(pk=settings.THIS_PLACE_PK)
    checkin_obj = Checkin(user=token_obj.user,
                            place=place_obj)
    checkin_obj.save()

    return {'success': True}