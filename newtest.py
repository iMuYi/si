def gongyue(power,monster_power):
    if power > monster_power:
        minnum = monster_power
    else:
        minnum = power
    for i in range(minnum,1,-1):
        #print divmod(power,i)
        #print divmod(monster_power,i)
        if divmod(power,i)[1] == 0 and divmod(monster_power,i)[1] == 0:
            return i
    return 1

first_raw = raw_input()
second_raw = raw_input()
num = first_raw.split(' ')[0]
power = first_raw.split(' ')[1]
print num
print power
try :
    num = int(num)
    power = int(power)
    print 'Num: '+num+' Power: '+power
except:
    print 'type wrong!'

b = second_raw.split(' ')
if len(b) != num:
    print 'type wrong'
monster_power=[]
try:
    for each in b:
        each_power = int(each)
        monster_power.append(each_power)
except:
    print 'type wrong!'
print monster_power

for i in range(num):
    if power>=monster_power[i]:
        power = power +monster_power[i]
    else:
        power = power + gongyue(power,monster_power[i])
    print power
print power