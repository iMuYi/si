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
    userLocList=[[{'LocNum':1,'GetTime':'20160126010000000'},{'LocNum':3,'GetTime':'20160126030000000'},{'LocNum':6,'GetTime':'20160126070000000'},{'LocNum':3,'GetTime':'20160126100000000'}],
                 [{'LocNum':2,'GetTime':'20160126010000000'},{'LocNum':1,'GetTime':'20160126030000000'},{'LocNum':4,'GetTime':'20160126070000000'},{'LocNum':1,'GetTime':'20160126100000000'}],
                 [{'LocNum':3,'GetTime':'20160126010000000'},{'LocNum':2,'GetTime':'20160126040000000'},{'LocNum':2,'GetTime':'20160126070000000'},{'LocNum':1,'GetTime':'20160126100000000'}],
                 [{'LocNum':5,'GetTime':'20160126010000000'},{'LocNum':6,'GetTime':'20160126070000000'},{'LocNum':6,'GetTime':'20160126080000000'},{'LocNum':1,'GetTime':'20160126110000000'}]]
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