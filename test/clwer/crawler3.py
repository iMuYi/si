__author__ = 'lenovo'
from bs4 import BeautifulSoup
import re
import urllib
def get_all_url(target_url):
    web = urllib.urlopen(target_url)
    soup = BeautifulSoup(web.read(),'html.parser')
    tags = soup.find_all(name='a',attrs={'href':re.compile("^https?://")})
    return tags
def dis_url(tags,localhost):
    locsite=[]
    othersite=[]
    for tag in tags:
        ret=tag
        if localhost in ret['href'].replace('//','').split('/')[0]:
            locsite.append(tag['href'])
        else:
            othersite.append(tag['href'])
    return locsite,othersite
        # re_freebuf = re.compile(r'(^https?://.*freebuf.com)')
        # if re.match(re_freebuf,tag['href']):
        #     freebuf.append(tag['href'])
        # else:
    #     othersite.append(tag['href'])
if __name__=='__main__':
    all_url=get_all_url('http://freebuf.com')
    locsite, othersite=dis_url(all_url,'freebuf.com')
