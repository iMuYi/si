__author__ = 'lenovo'
#coding:utf-8
from bs4 import BeautifulSoup
import re
import urllib
web = urllib.urlopen('http://freebuf.com')

soup = BeautifulSoup(web.read(),'html.parser')

tags = soup.find_all(name='a',attrs={'href':re.compile("^https?://")})
for tag in tags:
    print tag['href']