from django.shortcuts import render
from django.contrib.auth import authenticate, login

from decorators import json_response

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
