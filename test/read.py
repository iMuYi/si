__author__ = 'lenovo'
import os
import re
f = open(r'D:\lab\app\chuanshuwendang.txt','r')
lines=f.readlines()
for each in lines:
    pattern = re.compile(r'IMEI=864387020923286')
    match = pattern.match(each)
    patt_Lon = re.compile(r'Longitude=')
    patt_Lat = re.compile(r'Latitude=')
    if match:
        Log = patt_Lon.match(each)
        Lat = patt_Lat.match(each)
        print each


data={'data':[
                {'username':'xxxx',
                 'linkwifi':'xxxx',
                 'search':'xxxx,xxxx,xxxxx'},
                {'username':'xxxx',
                 'linkwifi':'xxxx',
                 'search':'xxxx,xxxx,xxxxx'},
                {'username':'xxxx',
                 'linkwifi':'xxxx',
                 'search':'xxxx,xxxx,xxxxx'},
            ]}
