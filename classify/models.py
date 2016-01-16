from django.db import models
from django.contrib import admin
from django.utils import timezone
import datetime


# Create your models here.


class User(models.Model):
    userName = models.CharField(max_length=30)
    password = models.CharField(max_length=30)
    userPhone = models.CharField(max_length=11)
    userRSRP = models.IntegerField(default=0)
    userSex = models.CharField(max_length=1)
    userX= models.DecimalField(max_digits=5, decimal_places=2,default=0)
    userY= models.DecimalField(max_digits=5, decimal_places=2,default=0)
    def __unicode__(self):
        return self.userName
class UserInfo(models.Model):
    user = models.ForeignKey(User)



    userStartTime=models.DateTimeField(blank=True)
    userEndTime=models.DateTimeField(blank=True)

class UserAdmin(admin.ModelAdmin):
    list_display = ('userName','userPhone','userSex','userRSRP','userX','userY')
admin.site.register(User,UserAdmin)