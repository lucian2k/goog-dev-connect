from django.db import models
from django.contrib.auth.models import User

# Extend the user model
USER_TYPES = (
    ('1', 'Checkin only'),
    ('2', 'Reports only'),
    ('3', 'All')
)
class ApplePiUser(models.Model):
    user = models.OneToOneField(User)
    role = models.PositiveSmallIntegerField(choices=USER_TYPES)
    checkins_count = models.PositiveIntegerField(defaul=0)

# Define place types (school, parc, etc) - defined for each instance in
# the app's settings
PLACE_TYPE_CHOICES = (
    ('1', 'School'),
    ('2', 'Parc'),
    ('3', 'Gym')
)
class Place(models.Model):
    place_type = models.PositiveSmallIntegerField(choices=PLACE_TYPE_CHOICES)
    # Add support for geo fields (spatialite and all)

# Define the checkin model
class Checkin(models.Model):
    user = models.ForeignKey(User)
    starttime = models.DateTimeField(auto_now_add=True)
    endtime = models.DateTimeField(null=True)
    # add maybe mood or other stuff here
