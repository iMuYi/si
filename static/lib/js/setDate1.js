/**//**
*使用方法：
* (1)只选择日期 <input type="text" name="date" readOnly onClick="setDay(this);">
* (2)选择日期和小时 <input type="text" name="dateh" readOnly onClick="setDayH(this);">
* (3)选择日期和小时及分钟 <input type="text" name="datehm" readOnly onClick="setDayHM(this);">
 *设置参数的方法
* (1)设置日期分隔符 setDateSplit(strSplit);默认为"-"
* (2)设置日期与时间之间的分隔符 setDateTimeSplit(strSplit);默认为" "
* (3)设置时间分隔符 setTimeSplit(strSplit);默认为":"
* (4)设置(1),(2),(3)中的分隔符 setSplit(strDateSplit,strDateTimeSplit,strTimeSplit);
* (5)设置开始和结束年份 setYearPeriod(intDateBeg,intDateEnd)
*/
//------------------ 样式定义 ---------------------------//
//功能按钮同样样式
var s_turn_base = "height:16px;font-size:9pt;color:white;border:0 solid #CCCCCC;cursor:hand;background-color:#2650A6;";
 //翻年、月等的按钮
var s_turn = "width:28px;" + s_turn_base;
//关闭、清空等按钮样式
var s_turn2 = "width:22px;" + s_turn_base;
//年选择下拉框
var s_select = "width:64px;display:none;";
//月、时、分选择下拉框
var s_select2 = "width:46px;display:none;";
//日期选择控件体的样式
var s_body = "width:150;background-color:#2650A6;display:none;z-index:9998;position:absolute;" +
 "border-left:1 solid #CCCCCC;border-top:1 solid #CCCCCC;border-right:1 solid #999999;border-bottom:1 solid #999999;";
 //显示日的td的样式
var s_day = "width:21px;height:20px;background-color:#D8F0FC;font-size:10pt;color:black;";
 //字体样式
var s_font = "color:#FFF;font-size:9pt;cursor:hand;";
//链接的样式
var s_link = "text-decoration:none;font-size:9pt;color:#2650A6;";
//横线
var s_line = "border-bottom:1 solid #6699CC";
//------------------ 变量定义 ---------------------------//

var DateNow = new Date();
var YearSt = 2000;//可选择的开始年份
var YearEnd = DateNow.getFullYear();//可选择的结束年份
var Year = DateNow.getFullYear(); //定义年的变量的初始值
var Month = DateNow.getMonth()+1; //定义月的变量的初始值
var Day = DateNow.getDate();
var Hour = 8;//DateNow.getHours();
var Minute = 0;//DateNow.getMinutes();
var ArrDay=new Array(42); //定义写日期的数组
var DateSplit = "-"; //日期的分隔符号
var DateTimeSplit = " "; //日期与时间之间的分隔符
var TimeSplit = ":"; //时间的分隔符号
var OutObject; //接收日期时间的对象
var arrHide = new Array();//被强制隐藏的标签
var m_bolShowHour = false;//是否显示小时
var m_bolShowMinute = false;//是否显示分钟
 
var m_aMonHead = new Array(12); //定义阳历中每个月的最大天数
m_aMonHead[0] = 31; m_aMonHead[1] = 28; m_aMonHead[2] = 31; m_aMonHead[3] = 30; m_aMonHead[4] = 31; m_aMonHead[5] = 30;
 m_aMonHead[6] = 31; m_aMonHead[7] = 31; m_aMonHead[8] = 30; m_aMonHead[9] = 31; m_aMonHead[10] = 30; m_aMonHead[11] = 31;
 // ---------------------- 用户可调用的函数 -----------------------------//
//用户主调函数－只选择日期
function setDay(obj){
OutObject = obj;
//如果标签中有值，则将日期初始化为当前值
var strValue = Trim(OutObject.value);
if( strValue != "" ){
InitDate(strValue);
}
PopCalendar();
}
//用户主调函数－选择日期和小时
function setDayH(obj){
OutObject = obj;
m_bolShowHour = true;
//如果标签中有值，则将日期和小时初始化为当前值
var strValue = Trim(OutObject.value);
if( strValue != "" ){
InitDate(strValue.substring(0,10));
var hour = strValue.substring(11,13);
if( hour < 10 ) Hour = hour.substring(1,2);
}
PopCalendar();
}
//用户主调函数－选择日期和小时及分钟
function setDayHM(obj){
OutObject = obj;
m_bolShowHour = true;
m_bolShowMinute = true;
//如果标签中有值，则将日期和小时及分钟初始化为当前值
var strValue = Trim(OutObject.value);
if( strValue != "" ){
InitDate(strValue.substring(0,10));
var time = strValue.substring(11,16);
var arr = time.split(TimeSplit);
Hour = arr[0];
Minute = arr[1];
if( Hour < 10 ) Hour = Hour.substring(1,2);
if( Minute < 10 ) Minute = Minute.substring(1,2);
}
PopCalendar();
}
//设置开始日期和结束日期
function setYearPeriod(intDateBeg,intDateEnd){
YearSt = intDateBeg;
YearEnd = intDateEnd;
}
//设置日期分隔符。默认为""
function setDateSplit(strDateSplit){
DateSplit = strDateSplit;
}
//设置日期与时间之间的分隔符。默认为" "
function setDateTimeSplit(strDateTimeSplit){
DateTimeSplit = strDateTimeSplit;
}
//设置时间分隔符。默认为":"
function setTimeSplit(strTimeSplit){
TimeSplit = strTimeSplit;
}
//设置分隔符
function setSplit(strDateSplit,strDateTimeSplit,strTimeSplit){
DateSplit(strDateSplit);
DateTimeSplit(strDateTimeSplit);
TimeSplit(strTimeSplit);
}
//设置默认的日期。格式为：YYYY-MM-DD
function setDefaultDate(strDate){
Year = strDate.substring(0,4);
Month = strDate.substring(5,7);
Day = strDate.substring(8,10);
}
//设置默认的时间。格式为：HH24:MI
function setDefaultTime(strTime){
Hour = strTime.substring(0,2);
Minute = strTime.substring(3,5);
}
// ---------------------- end 用户可调用的函数 -----------------------------//
//------------------ begin 页面显示部分 ---------------------------//
var weekName = new Array("日","一","二","三","四","五","六");
document.write('<div id="divDate" style="'+s_body+'" >');
 document.write('<div align="center" id="divDateText"  style="padding-top:2px;  ">');
 document.write('<span id="YearHead" Author="" style="'+s_font+'" '+

 'onclick="spanYearCEvent();"> 年</span>');
document.write('<select id="selTianYear" style="'+s_select+'" Author="" '+
 ' onChange="Year=this.value;SetDay(Year,Month);document.all.YearHead.style.display=\'\';'+
 'this.style.display=\'none\';">');
for(var i=YearSt;i <= YearEnd;i ++){
document.writeln('<option value="' + i + '">' + i + '年</option>');
}
document.write('</select>');
document.write('<span id="MonthHead" Author="" style="'+s_font+'" '+
 'onclick="spanMonthCEvent();"> 月</span>');
document.write('<select id="selTianMonth" style="'+s_select2+'" Author="" '+
 'onChange="Month=this.value;SetDay(Year,Month);document.all.MonthHead.style.display=\'\';'+
 'this.style.display=\'none\';">');
for(var i=1;i <= 12;i ++){
document.writeln('<option value="' + i + '">' + i + '月</option>');
}
document.write('</select>');
//document.write('</div>');
//document.write('<div align="center" id="divTimeText" Author="">');
 document.write('<span id="HourHead"  style="'+s_font+'display:none;" '+
 'onclick="spanHourCEvent();"> 时</span>');
document.write('<select id="selTianHour" style="'+s_select2+'display:none;" Author="" '+
 ' onChange="Hour=this.value;WriteHead();document.all.HourHead.style.display=\'\';' +
 'this.style.display=\'none\';">');
for(var i=0;i <= 23;i ++){
document.writeln('<option value="' + i + '">' + i + '时</option>');
}
document.write('</select>');
document.write('<span id="MinuteHead" Author="" style="'+s_font+'display:none;" '+
 'onclick="spanMinuteCEvent();"> 分</span>');
document.write('<select id="selTianMinute" style="'+s_select2+'display:none;" Author="" '+
 ' onChange="Minute=this.value;WriteHead();document.all.MinuteHead.style.display=\'\';'+
 'this.style.display=\'none\';">');
for(var i=0;i <= 59;i ++){
document.writeln('<option value="' + i + '">' + i + '分</option>');
}
document.write('</select>');
document.write('</div>');
//输出一条横线
document.write('<div style="'+s_line+'"></div>');
document.write('<div align="center" id="divTurn" style="border:0;" Author="">');
 document.write('<input type="button" style="'+s_turn+'" value="<&nbsp;&nbsp;年" title="上一年" onClick="PrevYear();">');
 document.write('<input type="button" style="'+s_turn+'" value=">" title="下一年" onClick="NextYear();"> ');
 document.write('<input type="button" style="'+s_turn+'" value="<&nbsp;&nbsp;月" title="上一月" onClick="PrevMonth();">');
 document.write('<input type="button" style="'+s_turn+'" value=">" title="下一月" onClick="NextMonth();">');
 document.write('</div>');
//输出一条横线
document.write('<div style="'+s_line+'"></div>');
document.write('<table border=0 cellspacing=0 cellpadding=0 bgcolor=white onselectstart="return false">');
 document.write(' <tr style="background-color:#2650A6;font-size:10pt;color:white;height:22px;" Author="">');
 for(var i =0;i < weekName.length;i ++){
//输出星期
document.write('<td width="21" align="center" Author="">' + weekName[i] + '</td>');
 }
document.write(' </tr>');
document.write('</table>');
//输出天的选择
document.write('<table border=0 cellspacing=1 cellpadding=0 bgcolor=white onselectstart="return false">');
 var n = 0;
for (var i=0;i<5;i++) {
document.write (' <tr align=center id="trDay' + i + '" >');
for (var j=0;j<7;j++){
document.write('<td align="center" id="tdDay' + n + '" '+
'onClick="Day=this.innerText;SetValue(true);" '
+' style="' + s_day +  '"> </td>');
n ++;
}
document.write (' </tr>');
}
document.write (' <tr align=center id="trDay5" >');
document.write('<td align="center" id="tdDay35" onClick="Day=this.innerText;SetValue(true);" '
 +' style="' + s_day + '"> </td>');
document.write('<td align="center" id="tdDay36" onClick="Day=this.innerText;SetValue(true);" '
 +' style="' + s_day + '"> </td>');
document.write('<td align="right" colspan="5"><a href="javascript:Clear();" style="' + s_link + '">清空</a>'+
 ' <a href="javascript:HideControl();" style="' + s_link + '">关闭</a>' +
 ' <a href="javascript:SetValue(true);" style="' + s_link + '">确定</a> ' +
 '</td>');
document.write (' </tr>');
document.write('</table>');
document.write('</div>');
//------------------ end 页面显示部分 ---------------------------//
//------------------ 显示日期时间的span标签响应事件 ---------------------------//
//单击年份span标签响应
function spanYearCEvent(){
hideElementsById(new Array("selTianYear","MonthHead"),false);
if(m_bolShowHour) hideElementsById(new Array("HourHead"),false);
if(m_bolShowMinute) hideElementsById(new Array("MinuteHead"),false);
hideElementsById(new Array("YearHead","selTianMonth","selTianHour","selTianMinute"),true);
 }
//单击月份span标签响应
function spanMonthCEvent(){
hideElementsById(new Array("selTianMonth","YearHead"),false);
if(m_bolShowHour) hideElementsById(new Array("HourHead"),false);
if(m_bolShowMinute) hideElementsById(new Array("MinuteHead"),false);
hideElementsById(new Array("MonthHead","selTianYear","selTianHour","selTianMinute"),true);
 }
//单击小时span标签响应
function spanHourCEvent(){
hideElementsById(new Array("YearHead","MonthHead"),false);
if(m_bolShowHour) hideElementsById(new Array("selTianHour"),false);
if(m_bolShowMinute) hideElementsById(new Array("MinuteHead"),false);
hideElementsById(new Array("HourHead","selTianYear","selTianMonth","selTianMinute"),true);
 }
//单击分钟span标签响应
function spanMinuteCEvent(){
hideElementsById(new Array("YearHead","MonthHead"),false);
if(m_bolShowHour) hideElementsById(new Array("HourHead"),false);
if(m_bolShowMinute) hideElementsById(new Array("selTianMinute"),false);
hideElementsById(new Array("MinuteHead","selTianYear","selTianMonth","selTianHour"),true);
 }
//根据标签id隐藏或显示标签
function hideElementsById(arrId,bolHide){
var strDisplay = "";
if(bolHide) strDisplay = "none";
for(var i = 0;i < arrId.length;i ++){
var obj = document.getElementById(arrId[i]);
obj.style.display = strDisplay;
}
}
//------------------ end 显示日期时间的span标签响应事件 ---------------------------//
//判断某年是否为闰年
function isPinYear(year){
var bolRet = false;
if (0==year%4&&((year%100!=0)||(year%400==0))) {
bolRet = true;
}
return bolRet;
}
//得到一个月的天数，闰年为29天
function getMonthCount(year,month){
var c=m_aMonHead[month-1];
if((month==2)&&isPinYear(year)) c++;
return c;
}
//重新设置当前的日。主要是防止在翻年、翻月时，当前日大于当月的最大日
function setRealDayCount() {
if( Day > getMonthCount(Year,Month) ) {
//如果当前的日大于当月的最大日，则取当月最大日
Day = getMonthCount(Year,Month);
}
}
//在个位数前加零
function addZero(value){
if(value < 10 ){
value = "0" + value;
}
return value;
}
//取出空格
function Trim(str) {
return str.replace(/(^\s*)|(\s*$)/g,"");
}
//为select创建一个option
function createOption(objSelect,value,text){
var option = document.createElement("OPTION");
option.value = value;
option.text = text;
objSelect.options.add(option);
}
//往前翻 Year
function PrevYear() {
if(Year > 999 && Year <10000){Year--;}
else{alert("年份超出范围（1000-9999）！");}
SetDay(Year,Month);
//如果年份小于允许的最小年份，则创建对应的option
if( Year < YearSt ) {
YearSt = Year;
createOption(document.all.selTianYear,Year,Year + "年");
}
checkSelect(document.all.selTianYear,Year);
WriteHead();
}
//往后翻 Year
function NextYear() {
if(Year > 999 && Year <10000){Year++;}
else{alert("年份超出范围（1000-9999）！");return;}
SetDay(Year,Month);
//如果年份超过允许的最大年份，则创建对应的option
if( Year > YearEnd ) {
YearEnd = Year;
createOption(document.all.selTianYear,Year,Year + "年");
}
checkSelect(document.all.selTianYear,Year);
WriteHead();
}
//选择今天
function Today() {
Year = DateNow.getFullYear();
Month = DateNow.getMonth()+1;
Day = DateNow.getDate();
SetValue(true);
//SetDay(Year,Month);
//selectObject();
}
//往前翻月份
function PrevMonth() {
if(Month>1){Month--}else{Year--;Month=12;}
SetDay(Year,Month);
checkSelect(document.all.selTianMonth,Month);
WriteHead();
}
//往后翻月份
function NextMonth() {
if(Month==12){Year++;Month=1}else{Month++}
SetDay(Year,Month);
checkSelect(document.all.selTianMonth,Month);
WriteHead();
}
//向span标签中写入年、月、时、分等数据
function WriteHead(){
document.all.YearHead.innerText = Year + "年";
document.all.MonthHead.innerText = Month + "月";
if( m_bolShowHour ) document.all.HourHead.innerText = " "+Hour + "时";
 if( m_bolShowMinute ) document.all.MinuteHead.innerText = Minute + "分";
 SetValue(false);//给文本框赋值，但不隐藏本控件
}
//设置显示天
function SetDay(yy,mm) {
 
setRealDayCount();//设置当月真实的日
WriteHead();
var strDateFont1 = "", strDateFont2 = "" //处理日期显示的风格
for (var i = 0; i < 37; i++){ArrDay[i]=""}; //将显示框的内容全部清空
var day1 = 1;
var firstday = new Date(yy,mm-1,1).getDay(); //某月第一天的星期几
for (var i = firstday; day1 < getMonthCount(yy,mm)+1; i++){
ArrDay[i]=day1;day1++;
}
//如果用于显示日的最后一行的第一个单元格的值为空，则隐藏整行。
//if(ArrDay[35] == ""){
// document.all.trDay5.style.display = "none";
//} else {
// document.all.trDay5.style.display = "";
//}
for (var i = 0; i < 37; i++){
var da = eval("document.all.tdDay"+i) //书写新的一个月的日期星期排列
if (ArrDay[i]!="") {
//判断是否为周末，如果是周末，则改为红色字体
if(i % 7 == 0 || (i+1) % 7 == 0){
strDateFont1 = "<font color=#f0000>"
strDateFont2 = "</font>"
} else {
strDateFont1 = "";
strDateFont2 = ""
}
da.innerHTML = strDateFont1 + ArrDay[i] + strDateFont2;
//如果是当前选择的天，则改变颜色
if(ArrDay[i] == Day ) {
da.style.backgroundColor = "#CCCCCC";
} else {
da.style.backgroundColor = "#EFEFEF";
}
da.style.cursor="hand"
} else {
da.innerHTML="";da.style.backgroundColor="";da.style.cursor="default"
}
}//end for
SetValue(false);//给文本框赋值，但不隐藏本控件
}//end function SetDay
//根据option的值选中option
function checkSelect(objSelect,selectValue) {
var count = parseInt(objSelect.length);
if( selectValue < 10 && selectValue.toString().length == 2) {
selectValue = selectValue.substring(1,2);
}
for(var i = 0;i < count;i ++){
if(objSelect.options[i].value == selectValue){
objSelect.selectedIndex = i;
break;
}
}//for
}
//选中年、月、时、分等下拉框
function selectObject(){
//如果年份小于允许的最小年份，则创建对应的option
if( Year < YearSt ) {
for( var i = Year;i < YearSt;i ++ ){
createOption(document.all.selTianYear,i,i + "年");
}
YearSt = Year;
}
//如果年份超过允许的最大年份，则创建对应的option
if( Year > YearEnd ) {
for( var i = YearEnd+1;i <= Year;i ++ ){
createOption(document.all.selTianYear,i,i + "年");
}
YearEnd = Year;
}
checkSelect(document.all.selTianYear,Year);
checkSelect(document.all.selTianMonth,Month);
if( m_bolShowHour ) checkSelect(document.all.selTianHour,Hour);
if( m_bolShowMinute ) checkSelect(document.all.selTianMinute,Minute);
}
//给接受日期时间的控件赋值
//参数bolHideControl - 是否隐藏控件
function SetValue(bolHideControl){
var value = "";
if( !Day || Day == "" ){
OutObject.value = value;
return;
}
var mm = Month;
var day = Day;
if( mm < 10 && mm.toString().length == 1) mm = "0" + mm;
if( day < 10 && day.toString().length == 1) day = "0" + day;
value = Year + DateSplit + mm + DateSplit + day;
if( m_bolShowHour ){
var hour = Hour;
if( hour < 10 && hour.toString().length == 1 ) hour = "0" + hour;
value += DateTimeSplit + hour;
}
if( m_bolShowMinute ){
var minute = Minute;
if( minute < 10 && minute.toString().length == 1 ) minute = "0" + minute;
value += TimeSplit + minute;
}
OutObject.value = value;
//document.all.divDate.style.display = "none";
if( bolHideControl ) {
HideControl();
}
}
//是否显示时间
function showTime(){
if( !m_bolShowHour && m_bolShowMinute){
alert("如果要选择分钟，则必须可以选择小时！");
return;
}
hideElementsById(new Array("HourHead","selTianHour","MinuteHead","selTianMinute"),true);
 if( m_bolShowHour ){
//显示小时
hideElementsById(new Array("HourHead"),false);
}
if( m_bolShowMinute ){
//显示分钟
hideElementsById(new Array("MinuteHead"),false);
}
}
//弹出显示日历选择控件，以让用户选择
function PopCalendar(){
//隐藏下拉框，显示相对应的head
hideElementsById(new Array("selTianYear","selTianMonth","selTianHour","selTianMinute"),true);
 hideElementsById(new Array("YearHead","MonthHead","HourHead","MinuteHead"),false);
 SetDay(Year,Month);
WriteHead();
showTime();
var dads = document.all.divDate.style;
var iX, iY;
 
var h = document.all.divDate.offsetHeight;
var w = document.all.divDate.offsetWidth;
//计算left
if (window.event.x + h > document.body.offsetWidth - 10 )
iX = window.event.x - h - 5 ;
else
iX = window.event.x + 5;
if (iX <0)
iX=0;
//计算top
iY = window.event.y;
if (window.event.y + w > document.body.offsetHeight - 10 )
iY = document.body.scrollTop + document.body.offsetHeight - w - 5 ;
else
iY = document.body.scrollTop +window.event.y + 5;
if (iY <0)
iY=0;
dads.left = iX;
dads.top = iY;
ShowControl();
selectObject();
}
//隐藏日历控件(同时显示被强制隐藏的标签)
function HideControl(){
document.all.divDate.style.display = "none";
ShowObject();
arrHide = new Array();//将被隐藏的标签对象清空
}
//显示日历控件(同时隐藏会遮挡的标签)
function ShowControl(){
document.all.divDate.style.display = "";
HideObject("SELECT");
HideObject("OBJECT");
}
//根据标签名称隐藏标签。如会遮住控件的select，object
function HideObject(strTagName) {
 
x = document.all.divDate.offsetLeft;
y = document.all.divDate.offsetTop;
h = document.all.divDate.offsetHeight;
w = document.all.divDate.offsetWidth;
 
for (var i = 0; i < document.all.tags(strTagName).length; i++)
{
 
var obj = document.all.tags(strTagName)[i];
if (! obj || ! obj.offsetParent)
continue;
// 获取元素对于BODY标记的相对坐标
var objLeft = obj.offsetLeft;
var objTop = obj.offsetTop;
var objHeight = obj.offsetHeight;
var objWidth = obj.offsetWidth;
var objParent = obj.offsetParent;
 
while (objParent.tagName.toUpperCase() != "BODY"){
objLeft += objParent.offsetLeft;
objTop += objParent.offsetTop;
objParent = objParent.offsetParent;
}
//alert("控件左端:" + x + "select左端" + (objLeft + objWidth) + "控件底部:" + (y+h) + "select高:" + objTop);
  
var bolHide = true;
if( obj.style.display == "none" || obj.style.visibility == "hidden" || obj.getAttribute("Author") == "" ){
 //如果标签本身就是隐藏的，则不需要再隐藏。如果是控件中的下拉框，也不用隐藏。
bolHide = false;
}
if( ( (objLeft + objWidth) > x && (y + h + 20) > objTop && (objTop+objHeight) > y && objLeft < (x+w) ) && bolHide ){
 //arrHide.push(obj);//记录被隐藏的标签对象
arrHide[arrHide.length] = obj;
obj.style.visibility = "hidden";
}
 
 
}
}
//显示被隐藏的标签
function ShowObject(){
for(var i = 0;i < arrHide.length;i ++){
//alert(arrHide[i]);
arrHide[i].style.visibility = "";
}
}
//初始化日期。
function InitDate(strDate){
var arr = strDate.split(DateSplit);
Year = arr[0];
Month = arr[1];
Day = arr[2];
}
//清空
function Clear(){
OutObject.value = "";
HideControl();
}
