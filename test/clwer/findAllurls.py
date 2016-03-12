__author__ = 'lenovo'
from bs4 import BeautifulSoup
import re
import urllib2
import urlparse
import time

url = 'http://www.freebuf.com'
domain = 'freebuf.com'
deep = 0
tmp = ''

sites=set()
visites=set()

def get_all_urls(urladdr,host):
    global deep
    global sites
    global tmp
    repeat_time = 0
    pages =set()
    while True:
        try:
            print 'Ready to Open teh web!'
            time.sleep(1)
            print 'Opening the web',urladdr
            web = urllib2.urlopen(url=urladdr,timeout=3)
            print "Success to Open the web"
            break
        except:
            print "Open Url Failed!!!Repeat"
            time.sleep(1)
            repeat_time = repeat_time + 1
            if repeat_time ==5:
                return

    print "Readint the web"
    soul = BeautifulSoup(web.read())
    print '...'
    tags = soul.find_all(name='a')

    for tag in tags:
        try:
            ret = tag['href']
        except:
            print "Maybe have no the attr: href"
            continue

        o = urlparse.urlparse(ret)
        if o[0] is '' and o[1] is '':
            print "Fix Page:" + ret
            url_obj = urlparse.urlparse(web.geturl())
            ret = url_obj[0] + "://" +url_obj[1] + url_obj[2] + ret
            ret = ret[:8]+ret[8:].replace('//','/')
            o = urlparse.urlparse(ret)
            if '../' in o[2]:
                paths =o[2].split('/')
                for i in range(len(paths)):
                    if paths[i] == '..':
                        paths[i] = ''
                        if paths[i-1] == '':
                            paths[i-1] = ''
                ret_path =''
                for path in paths:
                    if path == '':
                        continue
                    ret_path=ret_path+'/'+path
                ret  = ret.replace(o[2],ret_path)
            print "Fixed Page: " + ret
        if 'http' not in o[0]:
            print 'Bad Page: ' + ret.encode('ascii')
            continue
        if o[0] is "" and o[1] is not "":
            print 'Bad Page: ' + ret
        if domain not in o[1]:
            print 'Bad Page' + ret
        newpage =ret
        if newpage not in sites:
            print "Add New Page:" + newpage
            pages.add(newpage)
    return pages
def dfs(pages):
    if pages is set():
        return
    global url
    global domin
    global visites
    global sites
    sites = set.union(sites,pages)
    for page in sites:
        if page not in visites:
            visites.add(page)
            url = page
            pages = get_all_urls(url,domain)
            dfs(pages)
    print "success"
pages = get_all_urls(url,domain)
dfs(pages)
for i in sites:
    print i






