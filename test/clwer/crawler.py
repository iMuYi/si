__author__ = 'lenovo'

import urllib
import sgmllib
class handle_html(sgmllib.SGMLParser):
    '''unknow_starttag�������ǩ��ʼ����ʱ����
       unkonw_endtag�������ǩ����ʱ����'''
    def unknown_starttag(self, tag, attrs):
        #print "------------"+tag+" start--------------"
        try:
            for attr in attrs:
                # print attr[0],attr[1]
                if attr[0]=="href":
                    print attr[0]+":"+attr[1]
        except:
            pass

    def unknown_endtag(self, tag):
        #print "------------"+tag+" end----------------"
        pass

web = urllib.urlopen('http://freebuf.com')
web_handler = handle_html()
data=web_handler.feed(web.read())
