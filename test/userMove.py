__author__ = 'lenovo'


def disTime(startTime):
    timeArray=[]
    for i in range(0,25):
        if i<10:
            time = startTime[0:8]+'0'+str(i)+'0000000'
        else:
            time = startTime[0:8]+str(i)+'0000000'
        timeArray.append(time)
    return timeArray

def userMove():
    startTime = '20160126'
    d_tmp = [{'Latitude': 39.97041, 'style': 'l', 'RSRP': -95, 'Longitude': 116.36529, 'time': u'20160125103941033'}, {'Latitude': 39.97041, 'style': 'l', 'RSRP': -98, 'Longitude': 116.36514, 'time': u'20160125155609456'}, {'Latitude': 39.97041, 'style': 'l', 'RSRP': -98, 'Longitude': 116.36514, 'time': u'20160125155619424'}, {'Latitude': 39.97041, 'style': 'l', 'RSRP': -98, 'Longitude': 116.36514, 'time': u'20160125155629430'}]
    mappoint=[{'Longitude':116.363419,'Latitude':39.970383},
              {'Longitude':116.362642,'Latitude':39.968984},
              {'Longitude':116.36699,'Latitude':39.969637},
              {'Longitude':116.365332,'Latitude':39.970335},
              {'Longitude':116.363302,'Latitude':39.969775},
              {'Longitude':116.365463,'Latitude':39.969246}]
    each = 'aaa'
    userLocList=[]
    for every in d_tmp:
        dd_tmp=[]
        for i in range(0,len(mappoint)):
            print i
            if every['Longitude']<= mappoint[i]['Longitude']+0.0003 and every['Longitude'] >= mappoint[i]['Longitude']-0.0003 and every['Latitude']<= mappoint[i]['Latitude']+0.0003 and every['Latitude'] >= mappoint[i]['Latitude']-0.0003:
                tmp = {'username':each,
                       'LocNum':i+1,
                       'GetTime':every['time']}
                print 'find one..'
                dd_tmp.append(tmp)
        print dd_tmp
                        # break
        userLocList.append(dd_tmp)
    print userLocList
    timeArray=disTime(startTime)
    T=[]
    for each in userLocList:
        M=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        for every in each:
            for i in range(0,24):
                if every['GetTime']>=timeArray[i] and every['GetTime']<timeArray[i+1]:
                    M[i]=every['LocNum']
                    break
        tmp = 0
        firstTmp = 4
        for i in range(0,24):
            if M[i]!=0:
                if tmp ==0 :
                    firstTmp = M[i]
                tmp = M[i]
            else:
               M[i] = tmp
        i = 0
        while M[i] == 0:
            M[i]=firstTmp
            i = i + 1
            if i ==len(M):
                break
        T.append(M)
    userAlldayList = []
    print T
    for i in range(0,24):
        N=[0,0,0,0,0,0]
        for j in range(0,len(T)):
            if T[j][i] != 0:
                k= T[j][i]
                N[k-1] = N[k-1] + 1
        userAlldayList.append(N)
    print userAlldayList
    userMoveList = []
    for i in range(0,23):
        tran=[[0,0,0,0,0,0],
              [0,0,0,0,0,0],
              [0,0,0,0,0,0],
              [0,0,0,0,0,0],
              [0,0,0,0,0,0],
              [0,0,0,0,0,0]]
        for j in range(0,len(T)):
            startPoint = T[j][i]-1
            endPoint = T[j][i+1]-1
            if startPoint != endPoint:
                tran[startPoint][endPoint]=tran[startPoint][endPoint]+1
        userMoveList.append(tran)
        print tran
    return userMoveList
Move = userMove()