import csv
import urllib
import os
from bs4 import BeautifulSoup
web = urllib.urlopen('http://shop.freebuf.com')
soul = BeautifulSoup(web.read())
tags = soul.find_all(name='div',attrs={'class':'col-sm-6 col-md-4 col-lg-4 mall-product-list'})
print type(tags)
csvFile = open('item.csv','w+')
writer = csv.writer(csvFile)
writer.writerow(('name','price'))
for tag in tags:
    print tag
    name = tag.find(name='h4').string
    price = tag.find(name='strong').string
    writer.writerow((name.encode('utf-8','ignore'),price.encode('utf-8','ignore')))
csvFile.close()
print 'success to create the csvfile'