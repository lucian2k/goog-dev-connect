import datetime
import json

from django.shortcuts import render
from django.contrib.auth import authenticate, login

from daspi.apps.checkins.models import Place, UserTokens, Checkin
from decorators import json_response
from django.conf import settings
from django.http import HttpResponse

@json_response
def dologin(request):
    token = None

    if request.method == 'POST':
        data = json.loads(request.body)
        user = authenticate(username=data.get('user'),
                            password=data.get('pass'))
        if user is not None:
            # generate the key and return it
            try: token = user.usertokens_set.all().order_by('-pk')[0].value
            except: pass

            # just create the damn token
            if not token: token = user.applepiuser.generate_token()

    return HttpResponse('Unauthorized', status=401)

@json_response
def location(request):
    return _get_location().to_json()

@json_response
def checkin(request):
    # token = request.GET.get('token', None) # testing env
    token = request.POST.get('token', None)

    try: token_obj = UserTokens.objects.get(value=u'%s' % token)
    except: token_obj = None
    if not token_obj: return {'error': 'Invalid token', 'success': False}

    place_obj   = _get_location()

    # make sure the user is not checked in here
    checked_in = _is_checked_in(token_obj.user, place_obj)
    if checked_in:
        return {'error': 'Seems the user is already checked in here', 'success': False}

    # find the user and register the checkin
    checkin_obj = Checkin(user=token_obj.user,
                            place=place_obj)
    checkin_obj.save()

    return {'success': True}

@json_response
def checkout(request):
    # token = request.GET.get('token', None) # testing env
    token = request.POST.get('token', None)

    try: token_obj = UserTokens.objects.get(value=token)
    except: token_obj = None
    if not token_obj: return {'error': 'Invalid token', 'success': False}

    place_obj   = _get_location()

    checked_in = _is_checked_in(token_obj.user, place_obj)
    if not checked_in:
        return {'error': 'Seems that you are not checked in, you must checkin before attempting to checkout', 'success': False}

    checkin_obj = Checkin.objects.filter(user=token_obj.user,place=place_obj).order_by('-pk')[0]
    checkin_obj.endtime = datetime.datetime.now()
    checkin_obj.save()

    return {'success': True}


def _get_location():
    return Place.objects.get(pk=settings.THIS_PLACE_PK)

def _is_checked_in(user, place):
    return len(Checkin.objects.filter(endtime=None, user=user, place=place)\
                    .extra(where=["(strftime('%s', 'now') - starttime)/60/60 < 12"])) > 0
