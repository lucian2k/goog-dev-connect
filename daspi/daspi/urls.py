from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'daspi.apps.checkins.views.home', name='home'),
    url(r'^login/$', 'daspi.apps.checkins.views.dologin', name='login'),
    url(r'^logout/$', 'daspi.apps.checkins.views.dologout', name='logout'),
    url(r'^reports/$', 'daspi.apps.checkins.views.reports', name='reports'),
    url(r'^api/', include('daspi.apps.api.urls')),

    url(r'^admin/', include(admin.site.urls)),
)
