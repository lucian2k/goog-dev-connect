import hashlib
import datetime

from django.db import models
from django.contrib.auth.models import User

# Extend the user model
CHECKIN_ONLY =1
REPORTS_ONLY = 2
ALL = 3
USER_TYPE_REPORTS = [REPORTS_ONLY, ALL]

USER_TYPES = (
    (CHECKIN_ONLY, 'Checkin only'),
    (REPORTS_ONLY, 'Reports only'),
    (ALL, 'All')
)
class ApplePiUser(models.Model):
    user = models.OneToOneField(User)
    parent = models.ForeignKey('self', null=True)
    role = models.PositiveSmallIntegerField(choices=USER_TYPES)
    checkins_count = models.PositiveIntegerField(default=0)

    def generate_token(self):
        m = hashlib.md5()
        m.update(self.user.username)
        m.update(str(datetime.datetime.now()))

        token = m.hexdigest()

        ut = UserTokens()
        ut.user = self.user
        ut.value = token
        ut.save()

        return token

    def can_report(self):
        return self.role in USER_TYPE_REPORTS

class UserTokens(models.Model):
    user = models.ForeignKey(User)
    value = models.CharField(max_length=32)

# Define place types (school, parc, etc) - defined for each instance in
# the app's settings
PLACE_TYPE_CHOICES = (
    ('1', 'School'),
    ('2', 'Parc'),
    ('3', 'Gym')
)
class Place(models.Model):
    place_type = models.PositiveSmallIntegerField(choices=PLACE_TYPE_CHOICES)
    place_name = models.CharField(max_length=100)
    # Add support for geo fields (spatialite and all)

# Define the checkin model
class Checkin(models.Model):
    user = models.ForeignKey(User)
    place = models.ForeignKey(Place)
    starttime = models.DateTimeField(auto_now_add=True)
    endtime = models.DateTimeField(null=True)
    # add maybe mood or other stuff here
