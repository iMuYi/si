
__author__ = 'lenovo'

def Street(mapArray,lat1,lng1,lng2):
    while True:
        loc = [lat1,lng1,'S']
        if loc not in mapArray:
            mapArray.append(loc)
            #lat1 = lat1 - 0.00011
        lng1 = lng1 + 0.00015
        lng1 = float('%0.5f'%lng1)
        if lng1 > lng2:
            break
    return mapArray
    #print len(mapArray)
    #print mapArray

def Road(mapArray,lat1,lat2,lng1):
    while True:
        loc = [lat1,lng1,'R']
        locCompare = [lat1,lng1,'S']
        if locCompare in mapArray:
            for i in range(0,len(mapArray)):
                if mapArray[i] == locCompare:
                    mapArray[i][2] = 'X'
                    mapArray.append(mapArray[i])
                    break
        elif loc not in mapArray:
            mapArray.append(loc)
        lat1 = lat1 - 0.00011
        lat1 = float('%0.5f'%lat1)
        if lat1 < lat2:
            break
    return mapArray
    #print len(mapArray)
    #print mapArray

def getFinalMap():
    # Location point
    lat1 = 39.96942 + 0.00011
    lat2 = 39.96898 + 0.00011
    lat3 = 39.96843 + 0.00011
    lat4 = 39.96799 + 0.00011
    lat5 = 39.96964 + 0.00011
    lat6 = lat2
    lat7 = lat4
    lat8 = 39.97052 - 0.00011
    lat9 = 39.96942 + 0.00011
    lat10 = 39.96887
    lat11 = lat4 + 0.00011
    lat12 = 39.96942
    lat13 = lat11 + 0.00011
    lng1 = 116.36199
    lng2 = 116.36274
    lng3 = 116.36364
    lng4 = 116.36514
    lng5 = 116.36619
    lng6 = 116.36679
    lng7 = 116.36739
    mapArray = []
    finalMap = []
    finalMapArray = []
    #No1 Street
    mapArray = Street(mapArray,lat1,lng1,lng3)

    #No2 Street
    mapArray = Street(mapArray,lat2,lng1,lng3)

    #No3 Street
    mapArray = Street(mapArray,lat3,lng1,lng3)

    #No4 Street
    mapArray = Street(mapArray,lat4,lng1,lng3)

    #No5 Street
    mapArray = Street(mapArray,lat5,lng3,lng4)

    #No6 Street
    mapArray = Street(mapArray,lat6,lng3,lng4)

    #No7 Street
    mapArray = Street(mapArray,lat4,lng3,lng4)

    #No8 Street
    mapArray = Street(mapArray,lat8,lng4,lng7)

    #No9 Street
    mapArray = Street(mapArray,lat9,lng4,lng6)

    #No10 Street
    mapArray = Street(mapArray,lat10,lng4,lng7)

    #No11 Street
    mapArray = Street(mapArray,lat11,lng4,lng6)

    #No12 Street
    mapArray = Street(mapArray,lat12,lng6,lng7)

    #No11 Street
    mapArray = Street(mapArray,lat13,lng6,lng7)

    #No1 Road
    mapArray = Road(mapArray,lat1,lat4,lng1)

    #No2 Road
    mapArray = Road(mapArray,lat8,lat4,lng2)

    #No3 Road
    mapArray = Road(mapArray,lat8,lat4,lng3)

    #No4 Road
    mapArray = Road(mapArray,lat8,lat4,lng4)

    #No5 Road
    mapArray = Road(mapArray,lat8,lat10,lng5)

    #No6 Road
    mapArray = Road(mapArray,lat8,lat11,lng6)

    #No7 Road
    mapArray = Road(mapArray,lat8,lat13,lng7)

        #
    # for each in mapArray:
    #     if each[2] == 'X':
    #         print each

    i = 1
    for each in mapArray:
        if each[2] == 'X' and i > 145:
            print ''
        else:
            tmp = [each[0],each[1],each[2],i,0,0]
            finalMap.append(tmp)
            i += 1
    return finalMap

def getXMap():
    # Location point
    lat1 = 39.96942 + 0.00011
    lat2 = 39.96898 + 0.00011
    lat3 = 39.96843 + 0.00011
    lat4 = 39.96799 + 0.00011
    lat5 = 39.96964 + 0.00011
    lat6 = lat2
    lat7 = lat4
    lat8 = 39.97052 - 0.00011
    lat9 = 39.96942 + 0.00011
    lat10 = 39.96887
    lat11 = lat4 + 0.00011
    lat12 = 39.96942
    lat13 = lat11 + 0.00011
    lng1 = 116.36199
    lng2 = 116.36274
    lng3 = 116.36364
    lng4 = 116.36514
    lng5 = 116.36619
    lng6 = 116.36679
    lng7 = 116.36739
    mapArray = []
    finalMap = []
    #No1 Street
    mapArray = Street(mapArray,lat1,lng1,lng3)

    #No2 Street
    mapArray = Street(mapArray,lat2,lng1,lng3)

    #No3 Street
    mapArray = Street(mapArray,lat3,lng1,lng3)

    #No4 Street
    mapArray = Street(mapArray,lat4,lng1,lng3)

    #No5 Street
    mapArray = Street(mapArray,lat5,lng3,lng4)

    #No6 Street
    mapArray = Street(mapArray,lat6,lng3,lng4)

    #No7 Street
    mapArray = Street(mapArray,lat4,lng3,lng4)

    #No8 Street
    mapArray = Street(mapArray,lat8,lng4,lng7)

    #No9 Street
    mapArray = Street(mapArray,lat9,lng4,lng6)

    #No10 Street
    mapArray = Street(mapArray,lat10,lng4,lng7)

    #No11 Street
    mapArray = Street(mapArray,lat11,lng4,lng6)

    #No12 Street
    mapArray = Street(mapArray,lat12,lng6,lng7)

    #No11 Street
    mapArray = Street(mapArray,lat13,lng6,lng7)

    #No1 Road
    mapArray = Road(mapArray,lat1,lat4,lng1)

    #No2 Road
    mapArray = Road(mapArray,lat8,lat4,lng2)

    #No3 Road
    mapArray = Road(mapArray,lat8,lat4,lng3)

    #No4 Road
    mapArray = Road(mapArray,lat8,lat4,lng4)

    #No5 Road
    mapArray = Road(mapArray,lat8,lat10,lng5)

    #No6 Road
    mapArray = Road(mapArray,lat8,lat11,lng6)

    #No7 Road
    mapArray = Road(mapArray,lat8,lat13,lng7)

        #
    # for each in mapArray:
    #     if each[2] == 'X':
    #         print each

    i = 1
    for each in mapArray:
            tmp = [each[0],each[1],each[2],i,0,0]
            finalMap.append(tmp)
            i += 1
    return finalMap

def findWay(way,startpoint,destination,no):
    a1 = [12,13,14]
    a2 = [12,13,14,15]
    a3 = [12,13,14]
    a4 = [12,13,14,15]
    a5 = [14,15]
    a6 = [15,16,17,18]
    a7 = [15,16,17]
    a8 = [15,16,17,18]
    a9 = [15,17]
    a10 = [17,18]
    a11 = [17,18]
    a12 = [1,2,3,4]
    a13 = [1,2,3,4]
    a14 = [1,2,3,4]
    a15 = [6,5,7,2,8,9,4]
    a16 = [6,7,8]
    a17 = [6,7,8,9,10]
    a18 = [6,10,11,8]
    a = [0,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18]
    choices = a[way[-1]]
    #print choices
    print way
    allway = []
    no = no + 1
    for i in range(0,len(choices)):
        if choices[i] not in way:
            print '%d step,turn %d'%(no,choices[i])
            way.append(choices[i])
            if choices[i] != destination and destination not in way:
                findWay(way,startpoint,destination,no)
            if destination in way:
                print 'got it '
                print way
                allway.append(way)
                return way
            way.remove(choices[i])
            return way


            # elif no >= 5:
            #     print 'lose it'
            #     way = [startpoint,destination]
            #     return way


startpoint = 1
destinaton = 5
way = []
way.append(startpoint)

findWay(way,startpoint,destinaton,1)
