from django.shortcuts import render, render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext
from django import forms
from classify.models import User
from django.db import models
import simplejson
import unicodedata
import random
import pymongo
import time,datetime
from django.core.context_processors import csrf
from django.views.decorators.csrf import csrf_protect
# Create your views here.
from classify import mapdis
import os
from classify import DATA

class UserForm(forms.Form):
    userName = forms.CharField(label='userName',max_length=30)
    password = forms.CharField(label='password',widget=forms.PasswordInput())
    userPhone = forms.CharField(max_length=11)

    userSex = forms.CharField(max_length=1)
    userRSRP = forms.IntegerField()
    userX= forms.DecimalField(max_digits=5,decimal_places=2)
    userY= forms.DecimalField(max_digits=5,decimal_places=2)

def Mongolink():
    client = pymongo.MongoClient(host="112.126.73.45", port=27017)
    client.signal_db.authenticate('bupt','asdwe')
    db = client.signal_db
    return db

def str_to_fomart(stime):
    ftime = stime[0:4]+"-"+stime[4:6]+"-"+stime[6:8]+"-"+stime[8:10]+":"+stime[10:12]+":"+stime[12:14]
    return ftime

def getTimeArray(startTime,endTime,step):
    ftime1 = str_to_fomart(startTime)
    ftime2 = str_to_fomart(endTime)
    gtime1 =datetime.datetime.strptime(ftime1,"%Y-%m-%d-%H:%M:%S")
    gtime2 = datetime.datetime.strptime(ftime2,"%Y-%m-%d-%H:%M:%S")
    time_sec_float= time.mktime(gtime2.timetuple())-time.mktime(gtime1.timetuple())
    time_delta = time_sec_float/step
    time_array=[]
    for i in range(0,step+1):
        #print i
        time_array.append(time.strftime("%Y-%m-%d-%H:%M:%S",time.localtime(time.mktime(gtime1.timetuple())+i*time_delta)))
    return time_array

def timedis(startTime,endTime,time_delta):
    ftime1 = str_to_fomart(startTime)
    ftime2 = str_to_fomart(endTime)
    gtime1 =datetime.datetime.strptime(ftime1,"%Y-%m-%d-%H:%M:%S")
    gtime2 = datetime.datetime.strptime(ftime2,"%Y-%m-%d-%H:%M:%S")
    t1 = time.mktime(gtime1.timetuple())
    te = time.mktime(gtime2.timetuple())
    t2 = time.mktime(gtime1.timetuple())+time_delta
    timeArray = []
    while (t2<=te):
        begining = time.localtime(t1)
        ending = time.localtime(t2)
        t1 = t2
        t2 = t1 +time_delta
        begining = time.strftime("%Y-%m-%d-%H:%M:%S",begining)
        ending = time.strftime("%Y-%m-%d-%H:%M:%S",ending)
        begin = begining[0:4]+begining[5:7]+begining[8:10]+begining[11:13]+begining[14:16]+begining[17:19]+'000'
        end = ending[0:4]+ending[5:7]+ending[8:10]+ending[11:13]+ending[14:16]+ending[17:19]+'000'
        timeArray.append((begin,end))
    if timeArray == []:
        timeArray.append((startTime,endTime))
    return timeArray

def regist(request):
    if request.method == 'POST':
        name = request.POST['name']
        userid = request.POST['userid']
        password = request.POST['password']
        db = Mongolink()
        collection = db.User
        user = collection.find({"name": name, "userid": userid, "password": password})
        if user.count() == 0:
            posts={"name": name, "userid": userid, "password": password}
            collection.insert(posts)
            #print "success"
            data_tmp={"data": "success","username":name}
            data = simplejson.dumps(data_tmp)
            return HttpResponse(data)
        else:
            data_tmp = {"data": "failed"}
            data = simplejson.dumps(data_tmp)
            #print "falied"
            return HttpResponse(data)
    return render(request,'regist.html')

def login(request):
    return render(request,'login.html')

def check(req):
    if req.method == 'POST':
        userid = req.POST['userid']
        password = req.POST['password']
        #print userid
        #print password
        db = Mongolink()
        collection = db.User
        user=collection.find({"userid": userid, "password": password})
        if user.count() != 0:
            #print 'ok'
            response = HttpResponseRedirect('/classify/blank/')
            response.set_cookie('username','text')
            return response
    return render(req,'login.html')

def blank(request):
    #print 'blank'
    username = request.COOKIES.get('username','')

    return render(request,'blank.html',{'username':username})

def index(req):
    userName = req.COOKIES.get('userName', '')
    return render_to_response('index.html', {'userName':userName})

def searchMap(request):
    return render(request,'map.html')

#def tmp():
def complateData(data_tmp):
    print 'complateData'
    d_tmp = []
    mapdata = mapdis.getMap()
    #print mapdata
    for i in range(0,len(data_tmp)-1):
         if data_tmp[i+1]['Latitude'] != data_tmp[i]['Latitude'] and data_tmp[i+1]['Longitude'] != data_tmp[i]['Longitude']:
             if (data_tmp[i+1]['Latitude'],data_tmp[i]['Longitude']) in mapdata:
                 tmp = {'Longitude':data_tmp[i]['Longitude'],
                        'Latitude':data_tmp[i]['Latitude'],
                        'RSRP':data_tmp[i]['RSRP'],
                        'time':data_tmp[i]['time'],
                        'style':'l'
                        }
                 d_tmp.append(tmp)
                 tmp = {'Longitude':data_tmp[i]['Longitude'],
                        'Latitude':data_tmp[i+1]['Latitude'],
                        'RSRP':data_tmp[i]['RSRP'],
                        'time':data_tmp[i]['time'],
                        'style':'l'
                        }
                 d_tmp.append(tmp)
             elif (data_tmp[i]['Latitude'],data_tmp[i+1]['Longitude']) in mapdata:
                 tmp = {'Longitude':data_tmp[i]['Longitude'],
                       'Latitude':data_tmp[i]['Latitude'],
                       'RSRP':data_tmp[i]['RSRP'],
                       'time':data_tmp[i]['time'],
                       'style':'l'
                       }
                 d_tmp.append(tmp)
                 tmp = {'Longitude':data_tmp[i+1]['Longitude'],
                        'Latitude':data_tmp[i]['Latitude'],
                        'RSRP':data_tmp[i]['RSRP'],
                        'time':data_tmp[i]['time'],
                        'style':'l'
                        }
                 d_tmp.append(tmp)
                 print 'zhuanzhe'
             else:
                 tmp = {'Longitude':data_tmp[i]['Longitude'],
                        'Latitude':data_tmp[i]['Latitude'],
                        'RSRP':data_tmp[i]['RSRP'],
                        'time':data_tmp[i]['time'],
                        'style':'nl'
                        }
                 d_tmp.append(tmp)
                 print 'buzhuan'
         else:
             tmp = {'Longitude':data_tmp[i]['Longitude'],
                    'Latitude':data_tmp[i]['Latitude'],
                    'RSRP':data_tmp[i]['RSRP'],
                    'time':data_tmp[i]['time'],
                    'style':'l'
                    }
             d_tmp.append(tmp)
    print 'begin'
    for i in range(0,len(d_tmp)-3):
        if d_tmp[i]['style'] != 'delete':
            if d_tmp[i]['Longitude'] == d_tmp[i+1]['Longitude'] and d_tmp[i]['Latitude'] == d_tmp[i+1]['Latitude']:
                d_tmp[i]={'style':'delete'}
                continue
            if d_tmp[i]['Longitude'] == d_tmp[i+2]['Longitude'] and d_tmp[i]['Latitude'] == d_tmp[i+2]['Latitude']:
                d_tmp[i]={'style':'delete'}
                d_tmp[i+1]={'style':'delete'}
                continue
            if d_tmp[i]['Longitude'] == d_tmp[i+3]['Longitude'] and d_tmp[i]['Latitude'] == d_tmp[i+3]['Latitude']:
                d_tmp[i]={'style':'delete'}
                d_tmp[i+1]={'style':'delete'}
                d_tmp[i+2]={'style':'delete'}

                continue

    print len(d_tmp)
    dd_tmp=[]
    for each in d_tmp:
        if each['style'] !='delete':
            dd_tmp.append(each)
    print len(dd_tmp)
    print 'complateDataEnd'
    return dd_tmp

def lablink(startTime, endTime, idValue, signal):
        print 'labLink'
        data_tmp = []
        db = Mongolink()
        collection = db.Msignal
        print startTime
        print endTime
        user = collection.find({"U_ID": idValue, 'GetTime': {'$gt':startTime, '$lt': endTime}})
        print 'user'
        #print user
        #print len(user)
        finalmap = mapdis.getFinalMap()
        for each in user:

            lng = each['Longitude']
            #print lng
            lat = each['Latitude']
            #print lat
            #LocEor=each['LocEor']
            if signal == "Tx":
                RSRP = each['TX']
            elif signal == "Rx":
                RSRP = each['RX']
            else:
                RSRP = each['SS_3G']
            #print RSRP
            GetTime = each['GetTime']
            #print GetTime
            for every in finalmap:
                if RSRP != -113:
                    if every[2] == 'S':
                        if (lat <= every[0] + 0.00011) and (lat >= every[0] - 0.00022) and (lng >= every[1]) and (lng <= every[1]+0.00015):
                            tmp = {
                                    'Longitude': every[1],
                                    'Latitude': every[0],
                                    'RSRP': RSRP,
                                    'time': GetTime,
                                    #'LocEor':LocEor

                                  }
                            data_tmp.append(tmp)
                            break
                    elif every[2] == 'R':
                        if (lat <= every[0]) and (lat >= every[0] - 0.00011) and (lng >= every[1] - 0.00015) and (lng <= every[1]+0.0003):
                            tmp = {
                                    'Longitude': every[1],
                                    'Latitude': every[0],
                                    'RSRP': RSRP,
                                    'time': GetTime,
                                    #'LocEor':LocEor
                                  }
                            data_tmp.append(tmp)
                            break
                    elif every[2] =='X':
                        if (lat <= every[0]) and (lat >= every[0] - 0.00011) and (lng >= every[1]) and (lng <= every[1]+0.00015):
                            tmp = {
                                    'Longitude': every[1],
                                    'Latitude': every[0],
                                    'RSRP': RSRP,
                                    'time': GetTime,
                                    #'LocEor':LocEor
                                  }
                            data_tmp.append(tmp)
        #data_tmp2 = DATA.changedData3()
        #print data_tmp
        data_tmp = complateData(data_tmp)
        #print(data_tmp)
        print len(data_tmp)
        print 'lablinkEnd'
        return data_tmp

def allMap(operator, signal, zoom, lng1, lat1, lng2, lat2, startTime, endTime, flag):
    print 'AllMap'
    data_tmp = []
    d_tmp = []
    db = Mongolink()
    collection = db.Msignal
    #print 'Mongo Ready'
    siganlInfo = collection.find({'NetworkType':{'$in':operator}, 'Longitude': {'$gt': lng1, '$lt': lng2}, 'Latitude': {'$gt': lat2, '$lt': lat1}, 'GetTime': {'$gt': startTime, '$lt': endTime}})
    usefulInfo = []
    ChinaMobile = ['GPRS','EDGE','HSDPA','LTE']
    Unicom = ['EHRPD','HSPA','HSPAP','HSUPA','IDEN','UMTS']
    Telcom = ['CDMA','1xRTT','EVDO_0','EVDO_A','EVDO_B']

    # pre-coding
    for each in siganlInfo:
        if each['SS_3G']!=-113:
            if each['NetworkType'] in ChinaMobile:
                tmp = {'IMEI':each['U_ID'],
                       'Operator':'ChinaMobile',
                       'RSRP':each['SS_3G'],
                       'TX':each['TX'],
                       'RX':each['RX'],
                       'GetTime':each['GetTime'],
                       'Longitude':each['Longitude'],
                       'Latitude':each['Latitude'],
                   }
            elif each['NetworkType'] in Unicom:
                tmp = {'IMEI':each['U_ID'],
                       'Operator':'Unicom',
                       'RSRP':each['SS_3G'],
                       'TX':each['TX'],
                       'RX':each['RX'],
                       'GetTime':each['GetTime'],
                       'Longitude':each['Longitude'],
                       'Latitude':each['Latitude'],
                   }
            else:
                tmp = {'IMEI':each['U_ID'],
                       'Operator':'Telcom',
                       'RSRP':each['SS_3G'],
                       'TX':each['TX'],
                       'RX':each['RX'],
                       'GetTime':each['GetTime'],
                       'Longitude':each['Longitude'],
                       'Latitude':each['Latitude'],
                   }
            usefulInfo.append(tmp)
    #print len(usefulInfo)

    #get map infomation
    finalmap = mapdis.getFinalMap()
    meanRSRP =[0,0,0]
    meanTx = [0,0,0]
    meanRx = [0,0,0]
    userNum = [0,0,0]

    for each in usefulInfo:
        tmpFlag = 0
        # calculate the means
        if each['Operator']=='ChinaMobile':
            meanRSRP[0] += each['RSRP']
            meanTx[0] += each['TX']
            meanRx[0] += each['RX']
            userNum[0] += 1
        elif each['Operator'] in Unicom:
            meanRSRP[1] += each['RSRP']
            meanTx[1] += each['TX']
            meanRx[1] += each['RX']
            userNum[1] +=1
        else:
            meanRSRP[2] += each['RSRP']
            meanTx[2] += each['TX']
            meanRx[2] += each['RX']
            userNum[2] +=1
        #alocate the user into block
        for every in finalmap:
            if every[2] == 'S':
                if (each['Latitude'] <= every[0] + 0.00011) and (each['Latitude'] >= every[0] - 0.00022) and (each['Longitude'] >= every[1]) and (each['Longitude'] <= every[1]+0.00015):
                    every[4] = every[4] + 1
                    every[5] = every[5] + each['RSRP']
                    tmpFlag = 1
            elif every[2] == 'R':
                if (each['Latitude'] <= every[0]) and (each['Latitude'] >= every[0] - 0.00011) and (each['Longitude'] >= every[1] - 0.00015) and (each['Longitude'] <= every[1]+0.0003):
                    every[4] = every[4] + 1
                    every[5] = every[5] + each['RSRP']
                    tmpFlag = 1
            elif every[2] =='X':
                if (each['Latitude'] <= every[0]) and (each['Latitude'] >= every[0] - 0.00011) and (each['Longitude'] >= every[1]) and (each['Longitude'] <= every[1]+0.00015):
                    every[4] = every[4] + 1
                    every[5] = every[5] + each['RSRP']
                    tmpFlag = 1
            if tmpFlag == 1:
                break
    #calculate the mean of each operator
    for i in range(0,3):
        if userNum[i] != 0:
            meanRSRP[i] = meanRSRP[i]/userNum[i]
            meanRSRP[i] = float('%0.5f'%meanRSRP[i])
            meanRx[i] = meanRx[i]/userNum[i]
            meanRx[i] = float('%0.5f'%meanRx[i])
            meanTx[i] = meanTx[i]/userNum[i]
            meanTx[i] = float('%0.5f'%meanTx[i])

#######################################
    #calculate the mean of each block
    # for each in finalmap:
    #     if each[4] != 0:
    #         tmp = {'Latitude':each[0],
    #                'Longitude':each[1],
    #                'RSRP':each[5]/each[4],
    #                }
    #     else:
    #         tmp = {'Latitude':each[0],
    #                'Longitude':each[1],
    #                'RSRP':-100,
    #                }
    #     data_tmp.append(tmp)
########################################
    for i in range(0,len(finalmap)):
        if finalmap[i][4] != 0:
            tmp = {'Latitude':finalmap[i][0],
                   'Longitude':finalmap[i][1],
                   'RSRP':finalmap[i][5]/finalmap[i][4],
                   }
            #data_tmp.append(tmp)
        else:
            # tmp = {'Latitude':finalmap[i][0],
            #        'Longitude':finalmap[i][1],
            #        'RSRP':meanRSRP[0],
            #        }
            prenum = 0
            preRSRP = 0
            aftnum = 0
            aftRSRP = 0
            j = i - 1
            if j >= 0:
                while True:
                    print 'qian xiang...'
                    print j
                    if finalmap[j][4] != 0:
                        prenum = 1
                        preRSRP = finalmap[j][5]/finalmap[j][4]
                        break
                    if finalmap[j][2] == 'X':
                        print 'zhuanzhe'
                        break
                    if j <= 0 :
                        print 'yue jie'
                        break
                    j = j - 1
            if i+1 <= len(finalmap):
                j = i + 1
                while True:
                    print 'houxiang'
                    print j
                    if j>=len(finalmap):
                        print 'yue jie'
                        break
                    if finalmap[j][4] != 0:
                        aftnum = 1
                        aftRSRP = finalmap[j][5]/finalmap[j][4]
                        break
                    if finalmap[j][2] == 'X':
                        print 'zhuan zhe'
                        break
                    j = j + 1

            if prenum+aftnum > 0:
                tmp = {'Latitude':finalmap[i][0],
                       'Longitude':finalmap[i][1],
                       'RSRP':(preRSRP+aftRSRP)/(prenum+aftnum),}
            else:
                tmp = {'Latitude':finalmap[i][0],
                       'Longitude':finalmap[i][1],
                       'RSRP':meanRSRP[0],}
        data_tmp.append(tmp)



    if flag == 1:
         d_tmp = {'data': data_tmp,
                  'meanRSRP': meanRSRP,
                  'meanTx': meanTx,
                  'meanRx': meanRx,
                  }
    else:
        d_tmp = data_tmp
    print len(d_tmp)
    print 'allMapEnd'
    return d_tmp
@csrf_protect
def getSignalInfo(request):
    if request.method == 'POST':
        #print "starting"
        startTime = str(request.POST['startTime'])+'00000'
        #print startTime
        endTime = str(request.POST['endTime'])+'00000'
        #print endTime
        idValue = str(request.POST['idValue'])
        #print idValue
        zoom = '19' #str(request.POST['zoom'])
        lng1 = 116.36199 #float(request.POST['lng1'])
        lat1 = 39.97052 #float(request.POST['lat1'])
        lng2 = 116.36739 + 0.00015 #float(request.POST['lng2'])
        lat2 = 39.96799 #float(request.POST['lat2'])
        #print lng1, lng2, lat1, lat2
        operator_tmp=str(request.POST['operator'])
        operator_easy = operator_tmp.split(' ')
        #print operator_easy
        operator=['UNKNOW']
        if 'ChinaMobile' in operator_easy:
            operator.append('GPRS')
            operator.append('EDGE')
            operator.append('HSDPA')
            operator.append('LTE')
        if 'Unicom' in operator_easy:
            operator.append('EHRPD')
            operator.append('HSPA')
            operator.append('HSPAP')
            operator.append('HSUPA')
            operator.append('IDEN')
            operator.append('UMTS')
        if 'Telcom' in operator_easy:
            operator.append('CDMA')
            operator.append('1xRTT')
            operator.append('EVDO_0')
            operator.append('EVDO_A')
            operator.append('EVDO_B')
        signal = str(request.POST['signal'])
        #print operator,signal
        flag = 1
        data = simplejson.dumps(allMap(operator, signal, zoom, lng1, lat1, lng2, lat2, startTime, endTime,flag))
        #print 'data ready'
    else:
        return render(request,'blank.html')
    return HttpResponse(data)
    #data = simplejson.dumps()
    #return render(request,'blank.html',context=data)

def eachMap(operator, signal, zoom, lng1, lat1, lng2, lat2, startTime, endTime, flag):
    d_tmp = []
    db = Mongolink()
    collection = db.Msignal
    #print 'Mongo Ready'
    siganlInfo = collection.find({'NetworkType':{'$in':operator}, 'Longitude': {'$gt': lng1, '$lt': lng2}, 'Latitude': {'$gt': lat2, '$lt': lat1}, 'GetTime': {'$gt': startTime, '$lt': endTime}})
    usefulInfo = []
    ChinaMobile = ['GPRS','EDGE','HSDPA','LTE']
    Unicom = ['EHRPD','HSPA','HSPAP','HSUPA','IDEN','UMTS']
    Telcom = ['CDMA','1xRTT','EVDO_0','EVDO_A','EVDO_B']

    # pre-coding
    for each in siganlInfo:
        if each['NetworkType'] in ChinaMobile:
            tmp = {'IMEI':each['U_ID'],
                   'Operator':'ChinaMobile',
                   'RSRP':each['SS_3G'],
                   'TX':each['TX'],
                   'RX':each['RX'],
                   'GetTime':each['GetTime'],
                   'Longitude':each['Longitude'],
                   'Latitude':each['Latitude'],
               }
        elif each['NetworkType'] in Unicom:
            tmp = {'IMEI':each['U_ID'],
                   'Operator':'Unicom',
                   'RSRP':each['SS_3G'],
                   'TX':each['TX'],
                   'RX':each['RX'],
                   'GetTime':each['GetTime'],
                   'Longitude':each['Longitude'],
                   'Latitude':each['Latitude'],
               }
        else:
            tmp = {'IMEI':each['U_ID'],
                   'Operator':'Telcom',
                   'RSRP':each['SS_3G'],
                   'TX':each['TX'],
                   'RX':each['RX'],
                   'GetTime':each['GetTime'],
                   'Longitude':each['Longitude'],
                   'Latitude':each['Latitude'],
               }
        usefulInfo.append(tmp)
    #print len(usefulInfo)
    timeArray = timedis(startTime,endTime,300)
    print timeArray
    usefulInfo_tmp = []
    tmpFile = open(r'D:\lab\tmp\si\log\log.txt','a')
    tmpFile.write(str(usefulInfo)+'\r\n')

    for each in timeArray:
        print each[0][8:12]+' '+each[1][8:12]
        usefulInfo_tmp = []
        for every in usefulInfo:
            if (every['GetTime']>=each[0]) and (every['GetTime']<=each[1]):
                usefulInfo_tmp.append(every)
        tmpFile.write('usefulInfo_tmp:\r\n')
        tmpFile.write(str(usefulInfo_tmp)+'\r\n')


        #get map infomation
        finalmap = mapdis.getFinalMap()
        meanRSRP =[0,0,0]
        meanTx = [0,0,0]
        meanRx = [0,0,0]
        userNum = [0,0,0]
        for each in usefulInfo_tmp:
            tmpFlag = 0
            # calculate the means
            if each['Operator']=='ChinaMobile':
                meanRSRP[0] += each['RSRP']
                meanTx[0] += each['TX']
                meanRx[0] += each['RX']
                userNum[0] += 1
            elif each['Operator'] in Unicom:
                meanRSRP[1] += each['RSRP']
                meanTx[1] += each['TX']
                meanRx[1] += each['RX']
                userNum[1] +=1
            else:
                meanRSRP[2] += each['RSRP']
                meanTx[2] += each['TX']
                meanRx[2] += each['RX']
                userNum[2] +=1
            #alocate the user into block
            for every in finalmap:
                if every[2] == 'S':
                    if (each['Latitude'] <= every[0] + 0.00011) and (each['Latitude'] >= every[0] - 0.00022) and (each['Longitude'] >= every[1]) and (each['Longitude'] <= every[1]+0.00015):
                        every[4] = every[4] + 1
                        every[5] = every[5] + each['RSRP']
                        tmpFlag = 1
                elif every[2] == 'R':
                    if (each['Latitude'] <= every[0]) and (each['Latitude'] >= every[0] - 0.00011) and (each['Longitude'] >= every[1] - 0.00015) and (each['Longitude'] <= every[1]+0.0003):
                        every[4] = every[4] + 1
                        every[5] = every[5] + each['RSRP']
                        tmpFlag = 1
                elif every[2] =='X':
                    if (each['Latitude'] <= every[0]) and (each['Latitude'] >= every[0] - 0.00011) and (each['Longitude'] >= every[1]) and (each['Longitude'] <= every[1]+0.00015):
                        every[4] = every[4] + 1
                        every[5] = every[5] + each['RSRP']
                        tmpFlag = 1
                if tmpFlag == 1:
                    break
        ##print finalmap

        #calculate the mean of each operator
        for i in range(0,3):
            if userNum[i] != 0:
                meanRSRP[i] = meanRSRP[i]/userNum[i]
                meanRSRP[i] = float('%0.5f'%meanRSRP[i])
                meanRx[i] = meanRx[i]/userNum[i]
                meanRx[i] = float('%0.5f'%meanRx[i])
                meanTx[i] = meanTx[i]/userNum[i]
                meanTx[i] = float('%0.5f'%meanTx[i])

        #calculate the mean of each block
        data_tmp = []
        for i in range(0,len(finalmap)):
            if finalmap[i][4] != 0:
                tmp = {'Latitude':finalmap[i][0],
                       'Longitude':finalmap[i][1],
                       'RSRP':finalmap[i][5]/finalmap[i][4],
                       }
                #data_tmp.append(tmp)
            else:
                # tmp = {'Latitude':finalmap[i][0],
                #        'Longitude':finalmap[i][1],
                #        'RSRP':meanRSRP[0],
                #        }
                prenum = 0
                preRSRP = 0
                aftnum = 0
                aftRSRP = 0
                j = i - 1
                if j >= 0:
                    while True:
                        # print 'qian xiang...'
                        # print j
                        if finalmap[j][4] != 0:
                            prenum = 1
                            preRSRP = finalmap[j][5]/finalmap[j][4]
                            break
                        if finalmap[j][2] == 'X':
                            # print 'zhuanzhe'
                            break
                        if j <= 0 :
                            # print 'yue jie'
                            break
                        j = j - 1
                if i+1 <= len(finalmap):
                    j = i + 1
                    while True:
                        # print 'houxiang'
                        # print j
                        if j>=len(finalmap):
                            # print 'yue jie'
                            break
                        if finalmap[j][4] != 0:
                            aftnum = 1
                            aftRSRP = finalmap[j][5]/finalmap[j][4]
                            break
                        if finalmap[j][2] == 'X':
                            # print 'zhuan zhe'
                            break
                        j = j + 1

                if prenum+aftnum > 0:
                    tmp = {'Latitude':finalmap[i][0],
                           'Longitude':finalmap[i][1],
                           'RSRP':(preRSRP+aftRSRP)/(prenum+aftnum),}
                else:
                    tmp = {'Latitude':finalmap[i][0],
                           'Longitude':finalmap[i][1],
                           'RSRP':meanRSRP[0],}
            data_tmp.append(tmp)
            ##print data_tmp

        dd_tmp = {'data': data_tmp,
                 'meanRSRP': meanRSRP,
                 'meanTx': meanTx,
                 'meanRx': meanRx,
                 }
        d_tmp.append(dd_tmp)
    tmpFile.close()
    finaldata = {'data':d_tmp}
    return finaldata

def getDataInfo(request):
    if request.method == 'POST':
        #print "starting"
        startTime = str(request.POST['startTime'])+'00000'
        #print startTime
        endTime = str(request.POST['endTime'])+'00000'
        #print endTime
        zoom = '19' #str(request.POST['zoom'])
        lng1 = 116.36199 #float(request.POST['lng1'])
        lat1 = 39.97052 #float(request.POST['lat1'])
        lng2 = 116.36739 + 0.00015 #float(request.POST['lng2'])
        lat2 = 39.96799 #float(request.POST['lat2'])
        #print lng1, lng2, lat1, lat2
        operator_tmp=str(request.POST['operator'])
        operator_easy = operator_tmp.split(' ')
        #print operator_easy
        operator=['UNKNOW']
        if 'ChinaMobile' in operator_easy:
            operator.append('GPRS')
            operator.append('EDGE')
            operator.append('HSDPA')
            operator.append('LTE')
        if 'Unicom' in operator_easy:
            operator.append('EHRPD')
            operator.append('HSPA')
            operator.append('HSPAP')
            operator.append('HSUPA')
            operator.append('IDEN')
            operator.append('UMTS')
        if 'Telcom' in operator_easy:
            operator.append('CDMA')
            operator.append('1xRTT')
            operator.append('EVDO_0')
            operator.append('EVDO_A')
            operator.append('EVDO_B')
        signal = str(request.POST['signal'])
        #print operator,signal
        flag = 1
        data = simplejson.dumps(eachMap(operator, signal, zoom, lng1, lat1, lng2, lat2, startTime, endTime,flag))
        #print 'data ready'
    else:
        return render(request,'blank.html')
    return HttpResponse(data)

def getCompareInfo(request):
    if request.method == 'POST':
        #print "CompareInfo starting"
        startTime = str(request.POST['startTime'])+'00000'
        #print startTime
        endTime = str(request.POST['endTime'])+'00000'
        #print endTime
        zoom = str(request.POST['zoom'])
        lng1 = float(request.POST['lng1'])
        lat1 = float(request.POST['lat1'])
        lng2 = float(request.POST['lng2'])
        lat2 = float(request.POST['lat2'])
        #print lng1, lng2, lat1, lat2
        operator_tmp=str(request.POST['operator'])
        operator_easy = operator_tmp.split(' ')
        #print operator_easy
        flag = 0
        ChinaMobile = ['GPRS','EDGE','HSDPA','LTE']
        Unicom = ['EHRPD','HSPA','HSPAP','HSUPA','IDEN','UMTS','UNKNOW']
        Telcom = ['CDMA','1xRTT','EVDO_0','EVDO_A','EVDO_B']
        signal = str(request.POST['signal'])
        if 'ChinaMobile' not in operator_easy:
            #print 'Unicom'
            data1 = allMap(Unicom, signal, zoom, lng1, lat1, lng2, lat2, startTime, endTime, flag)
            #print 'Telcom'
            data2 = allMap(Telcom, signal, zoom, lng1, lat1, lng2, lat2, startTime, endTime,flag)
            d_tmp = {'data1': data1,
                     'data2': data2,}
        elif 'Unicom' not in operator_easy:
            #print 'ChinaMobile'
            data1 = allMap(ChinaMobile, signal, zoom, lng1, lat1, lng2, lat2, startTime, endTime,flag)
            #print 'Telcom'
            data2 = allMap(Telcom, signal, zoom, lng1, lat1, lng2, lat2, startTime, endTime,flag)
            d_tmp = {'data1': data1,
                     'data2': data2,}
        elif 'Telcom' not in operator_easy:
            #print 'ChinaMobile'
            data1 = allMap(ChinaMobile, signal, zoom, lng1, lat1, lng2, lat2, startTime, endTime,flag)
            #print  'Unicom'
            data2 = allMap(Unicom, signal, zoom, lng1, lat1, lng2, lat2, startTime, endTime,flag)
            d_tmp = {'data1': data1,
                     'data2': data2,}
        else:
            #print 'ChinaMobile'
            data1 = allMap(ChinaMobile, signal, zoom, lng1, lat1, lng2, lat2, startTime, endTime,flag)
            #print 'Unicom'
            data2 = allMap(Unicom, signal, zoom, lng1, lat1, lng2, lat2, startTime, endTime,flag)
            #print  'Telcom'
            data3 = allMap(Telcom, signal, zoom, lng1, lat1, lng2, lat2, startTime, endTime,flag)
            d_tmp = {'data1': data1,
                     'data2': data2,
                     'data3': data3,}
        #print signal
        data = simplejson.dumps(d_tmp)
        #print 'data ready'
    else:
        return render(request,'blank.html')
    return HttpResponse(data)

def getUsers(request):
    print 'getUsers'
    if request.method=="POST":
        #print 'getUsers'
        db = Mongolink()
        collection = db.Msignal
        #print "starting"
        startTime = str(request.POST['startTime'])+'00000'
        print startTime
        endTime = str(request.POST['endTime'])+'00000'
        print endTime
        lng1 = 116.36199 #float(request.POST['lng1'])
        lat1 = 39.97052 #float(request.POST['lat1'])
        lng2 = 116.36739 + 0.00015 #float(request.POST['lng2'])
        lat2 = 39.96799 #float(request.POST['lat2'])
        user = collection.find({'Longitude': {'$gt': lng1, '$lt': lng2}, 'Latitude': {'$gt': lat2, '$lt': lat1}, 'GetTime': {'$gt': startTime, '$lt': endTime}})
        username=[]
        for each in user:
            username.append(each['U_ID'])
        data_tmp=list(set(username))
        #print data_tmp
        d_tmp = {'data':data_tmp}
        data =simplejson.dumps(d_tmp)
        print 'getUsersEnd'
        return HttpResponse(data)

def userTrack(request):
    #print "here"
    return render(request, 'track.html')

def getUserInfo(request):
    print 'getUserInfo'
    if request.method == 'POST':
        #print "starting"
        startTime = str(request.POST['startTime'])+'00000'
        #print "startTime"+startTime
        endTime = str(request.POST['endTime'])+'00000'
        #print "endTime"+endTime
        idValue = str(request.POST['idValue'])
        #print "idValue"+idValue
        #print type(idValue)
        signal = str(request.POST['signal'])
        username = idValue.split(' ')
        #print username
        data_tmp=[]
        # data1 = DATA.changedData()
        # data2 = DATA.changedData3()
        # data_tmp.append(data1)
        # data_tmp.append(data2)
        for each in username:
            if each != '':
                #print each
                d_tmp = lablink(startTime, endTime, each, signal)
                data_tmp.append(d_tmp)
                #print 'append success'
        data_tmp2 = {'data':data_tmp}
        #print data_tmp2
        data = simplejson.dumps(data_tmp2)
        #data = simplejson.dumps(lablink(startTime, endTime, idValue))
    else:
        data = simplejson.dumps()
    print 'getUserTrackEnd'
    return HttpResponse(data)

def allFlot(lng1, lng2, lat1, lat2, startTime, endTime):
    db = Mongolink()
    collection = db.Msignal
    #print 'Mongo Ready'
    user = collection.find({'Longitude': {'$gt': lng1, '$lt': lng2}, 'Latitude': {'$gt': lat1, '$lt': lat2}, 'GetTime': {'$gt': startTime, '$lt': endTime}})
    user_num = collection.count({'Longitude': {'$gt': lng1, '$lt': lng2}, 'Latitude': {'$gt': lat1, '$lt': lat2}, 'GetTime': {'$gt': startTime, '$lt': endTime}})

    time_array = getTimeArray(startTime,endTime,10)
    RSRP_ChinaMobile_array = [0,0,0,0,0,0,0,0,0,0]
    num_ChinaMobile_array = [0,0,0,0,0,0,0,0,0,0]
    RSRP_Unicom_array = [0,0,0,0,0,0,0,0,0,0]
    num_Unicom_array = [0,0,0,0,0,0,0,0,0,0]
    RSRP_Telcom_array = [0,0,0,0,0,0,0,0,0,0]
    num_Telcom_array = [0,0,0,0,0,0,0,0,0,0]
    ChinaMobile = ['GPRS','EDGE','HSDPA','LTE']
    Unicom = ['EHRPD','HSPA','HSPAP','HSUPA','IDEN','UMTS']
    Telcom = ['CDMA','1xRTT','EVDO_0','EVDO_A','EVDO_B']
    #print user_num
    #print time_array

    for each in user:
        for i in range(0,10):
            tmpTime = str_to_fomart(each['GetTime'])
            if (tmpTime>time_array[i]) and (tmpTime<time_array[i+1]):
                if each['NetworkType'] in ChinaMobile:
                    #print 'ChinaMobile'
                    RSRP_ChinaMobile_array[i] += each['SS_3G']
                    num_ChinaMobile_array[i] += 1
                elif each['NetworkType'] in Unicom:
                    #print 'Unicom'
                    RSRP_Unicom_array[i] += each['SS_3G']
                    num_Unicom_array[i] += 1
                else:
                    #print 'Telcom'
                    RSRP_Telcom_array[i] += each['SS_3G']
                    num_Telcom_array[i] += 1
    d_Telcom_tmp = []
    d_Unicom_tmp = []
    d_ChinaMobile_tmp = []
    d_time_tmp = []
    Telcom_num = 0
    ChinaMobile_num = 0
    Unicom_num = 0
    #print "sum ending"
    for i in range(0,10):
        if num_Telcom_array[i] != 0:
            RSRP_Telcom_array[i] /= num_Telcom_array[i]
            Telcom_num += num_Telcom_array[i]
        d_Telcom_tmp.append(RSRP_Telcom_array[i])
        if num_Unicom_array[i] != 0:
            RSRP_Unicom_array[i] /= num_Unicom_array[i]
            Unicom_num += num_Unicom_array[i]
        d_Unicom_tmp.append(RSRP_Unicom_array[i])
        if num_ChinaMobile_array[i] != 0:
            RSRP_ChinaMobile_array[i] /= num_ChinaMobile_array[i]
            ChinaMobile_num += num_ChinaMobile_array[i]
        d_ChinaMobile_tmp.append(RSRP_ChinaMobile_array[i])
        d_time_tmp.append(time_array[i+1])
#    d_ChinaMobile_tmp = [0,10,20,30,40,50,60,70,80,90]
#    d_Unicom_tmp = [90,80,70,60,50,40,30,20,10,0]
#    d_Telcom_tmp = [9,8,7,6,5,4,3,2,1,0]
#    for i in range(1,11):
#        d_time_tmp.append(time_array[i])
    #print "avg ending"
    data_tmp={'ChinaMobile':d_ChinaMobile_tmp,
              'CN':ChinaMobile_num,
              'Unicom':d_Unicom_tmp,
              'UN':Unicom_num,
              'Telcom':d_Telcom_tmp,
              'TN':Telcom_num,
              'TIME':d_time_tmp}
    #print data_tmp
    data = simplejson.dumps(data_tmp)
    return data

def getFlotInfo(request):
    if request.method == 'POST':
        #print "starting"
        startTime = str(request.POST['startTime'])+'00000'
        #print startTime
        endTime = str(request.POST['endTime'])+'00000'
        #print endTime
        lng1 = 116.363062#float(request.POST['lng1'])
        lat1 = 39.968772#float(request.POST['lat1'])
        lng2 = 116.367432#float(request.POST['lng2'])
        lat2 = 39.971192#float(request.POST['lat2'])
        #print lng1, lng2, lat1, lat2
        data = allFlot(lng1, lng2, lat1, lat2, startTime, endTime)
    else:
        data_tmp = {}
        data=simplejson.dumps(data_tmp)
    #print data
    return HttpResponse(data)

def wifi(request):
    return render(request,'wifi.html')
def getWifiInfo(request):
        db = Mongolink()
        wifiInfo = db.Wsignal
        nearwifiInfo = db.NearWifi
        wifiList = []
        userList = []
        #if request.method =='POST':
        #print 'starting'
        startTime = str(request.POST['startTime'])+'00000'
        #print startTime
        endTime = str(request.POST['endTime'])+'00000'
        #print endTime
        users = wifiInfo.find({ 'currentDate': {'$gt': startTime, '$lt': endTime}})
        nearwifis = nearwifiInfo.find({'currentDate': {'$gt': startTime, '$lt': endTime}})
        username = []
        wifiname = []
        user = []
        nearwifi = []
        #user name append
        for each in users:
            user.append(each)
        for each in user:
            if each['IMEI'] not in username:
                username.append(each['IMEI'])
        #wifi name append
        for each in nearwifis:
            nearwifi.append(each)
        for each in user:
            if each['wifiName'] not in wifiname:
                wifiname.append(each['wifiName'])
        #print wifiname
        for each in nearwifi:
            if each['wifiName'] not in wifiname:
                wifiname.append(each['wifiName'])
        #print wifiname
        #wifiList
        for each in wifiname:
            tmp = {'name':each}
            wifiList.append(tmp)
        #print wifiList
        #userList
        for each in username:
                #print each
                linkwifi = ''
                searchwifi = ''
                #print linkwifi
                #print searchwifi
                linked = []
                searched = []
                #print 'linking...'
                for every in user:
                    if (every['IMEI'] == each) and (every['wifiName'] not in linked):
                        linked.append(every['wifiName'])
                #print linked
                #print 'searching...'
                for every in nearwifi:
                    if (every['IMEI'] == each) and (every['wifiName'] not in searched):
                        searched.append(every['wifiName'])
                #print searched
                for every in linked:
                    for i in range(0,len(wifiname)):
                        if wifiname[i] == every:
                            if linkwifi == '':
                                linkwifi =str(i+1)
                            else:
                                linkwifi = linkwifi+','+str(i+1)
                for every in searched:
                    for i in range(0,len(wifiname)):
                        if wifiname[i] == every:
                            if searchwifi == '':
                                searchwifi =str(i+1)
                            else:
                                searchwifi = searchwifi+','+str(i+1)
                tmp = {'name':each,
                       'linked':linkwifi,
                       'searched':searchwifi}
                userList.append(tmp)
        #print userList
        data_tmp = {'wifi':wifiList,
                    'user':userList}
        data = simplejson.dumps(data_tmp)
        #print data
        #print 'ending'
        return HttpResponse(data)
    # else:
    #     wifiList = []
    #     userList =[]
    #     data_tmp ={'wifi':wifiList,
    #                'user':userList,
    #                }
    #     data = simplejson.dumps(data_tmp)
    #     return data
def getunWifiInfo(request):
        db = Mongolink()
        wifiInfo = db.Wsignal
        wifiList = []
        userList = []
        #if request.method =='POST':
        #print 'starting'
        startTime = str(request.POST['startTime'])+'00000'
        #print startTime
        endTime = str(request.POST['endTime'])+'00000'
        #print endTime
        users = wifiInfo.find({ 'currentDate': {'$gt': startTime, '$lt': endTime}})
        username = []
        wifiname = []
        user = []
        #user name append
        for each in users:
            user.append(each)
        for each in user:
            if each['IMEI'] not in username:
                username.append(each['IMEI'])
        for each in user:
            if each['wifiName'] not in wifiname:
                wifiname.append(each['wifiName'])
        #print wifiname
        #wifiList
        for each in wifiname:
            tmp = {'name':each}
            wifiList.append(tmp)
        #print wifiList
        #userList
        for each in username:
                #print each
                linkwifi = ''
                searchwifi = ''
                #print linkwifi
                #print searchwifi
                linked = []
                searched = []
                #print 'linking...'
                for every in user:
                    if (every['IMEI'] == each) and (every['wifiName'] not in linked):
                        linked.append(every['wifiName'])
                #print linked
                for every in linked:
                    for i in range(0,len(wifiname)):
                        if wifiname[i] == every:
                            if linkwifi == '':
                                linkwifi =str(i+1)
                            else:
                                linkwifi = linkwifi+','+str(i+1)
                tmp = {'name':each,
                       'linked':linkwifi,
                      }
                userList.append(tmp)
        #print userList
        data_tmp = {'wifi':wifiList,
                    'user':userList}
        data = simplejson.dumps(data_tmp)
        #print data
        #print 'ending'
        return HttpResponse(data)
    # else:
    #     wifiList = []
    #     userList =[]
    #     data_tmp ={'wifi':wifiList,
    #                'user':userList,
    #                }
    #     data = simplejson.dumps(data_tmp)
    #     return data







