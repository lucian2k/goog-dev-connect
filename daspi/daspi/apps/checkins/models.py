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

# Define place types (school, parc, etc)

# Define the checkin model

