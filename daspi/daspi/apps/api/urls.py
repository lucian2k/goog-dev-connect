from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'^login/$', 'daspi.apps.api.views.dologin', name='apilogin'),
    url(r'^location/$', 'daspi.apps.api.views.location', name='locationdetails'),
    url(r'^checkin/$', 'daspi.apps.api.views.checkin', name='checkin'),
)
