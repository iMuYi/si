# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('userName', models.CharField(max_length=30)),
                ('password', models.CharField(max_length=30)),
                ('userPhone', models.CharField(max_length=11)),
                ('userRSRP', models.IntegerField(default=0)),
                ('userSex', models.CharField(max_length=1)),
                ('userX', models.DecimalField(default=0, max_digits=5, decimal_places=2)),
                ('userY', models.DecimalField(default=0, max_digits=5, decimal_places=2)),
            ],
        ),
        migrations.CreateModel(
            name='UserInfo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('userStartTime', models.DateTimeField(blank=True)),
                ('userEndTime', models.DateTimeField(blank=True)),
                ('user', models.ForeignKey(to='classify.User')),
            ],
        ),
    ]
