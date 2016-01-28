__author__ = 'MuYi0420'
from django.conf.urls import url, patterns
from classify import views


urlpatterns = patterns('',
                        url(r'^$', views.login, name='login'),
                        url(r'^login/$', views.login, name='login'),
                        url(r'^check/$', views.check, name='login'),

                        url(r'^regist/$', views.regist, name='regist'),
                        #url(r'^create/$', views.create, name='regist'),
                        url(r'^blank/$', views.blank, name='blank'),
                        url(r'^wifi/$', views.wifi, name='wifi'),
                        url(r'^index/$', views.index, name='index'),
                        url(r'^search/$', views.searchMap, name='search'),
                        url(r'^getUsers/$', views.getUsers, name='search'),
                        url(r'^getCompareInfo/$', views.getCompareInfo, name='compare'),
                        url(r'^getFlotInfo/$', views.getFlotInfo, name='compare'),
                        url(r'^getWifiInfo/$', views.getWifiInfo, name='getwifiinfo'),
                        url(r'^getunWifiInfo/$', views.getunWifiInfo, name='getunwifiinfo'),
                        url(r'^getSignalInfo/$', views.getSignalInfo, name='getsignalinfo'),
                        url(r'^getDataInfo/$', views.getDataInfo, name='getdatainfo'),
                        url(r'^userTrack/$', views.userTrack, name='track'),
                        url(r'^Move/$', views.Move, name='Move'),

                        url(r'^userMove/$', views.userMove, name='Move'),
                        url(r'^getUserInfo/$', views.getUserInfo, name='getuserinfo'),
                        )