__author__ = 'lenovo'
a={'a':1}
b={'a':2}
c={'a':4}
d=[a,c,b]
print d
m=sorted(d,key=lambda x:x['a'])
print m