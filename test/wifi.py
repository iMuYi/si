__author__ = 'lenovo'
import pymongo
def Mongolink():
    client = pymongo.MongoClient(host="112.126.73.45", port=27017)
    client.signal_db.authenticate('bupt','asdwe')
    db = client.signal_db
    return db

db = Mongolink()
wifiInfo = db.Msignal
nearwifiInfo = db.NearWifi
u = wifiInfo.distinct("U_ID")
l =len(u)
s = wifiInfo.stats()
print u
print l
print s