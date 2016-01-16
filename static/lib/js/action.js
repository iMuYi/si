//地图模式时间选择
function getHisTime(){
	var d1=document.getElementById("startTime").value;
	var d2=document.getElementById("endTime").value;
  	var	d = new Date();
  	var	dn = d.getFullYear()+ "-"+addZero((d.getMonth() + 1)) + "-"+addZero(d.getDate())+ " "+addZero(d.getHours())+ ":"+addZero(d.getMinutes());//+addZero(d.getSeconds());//当前时间
	if(d1&&d2!=""){	
	    if(d1>dn||d2>dn){
				alert("设置时间晚于当前时间请重新设置！");
		}     
   		else if(d1!=""&&d1>=d2){
				alert("结束时间早于开始时间请重新设置！");
		} 	
		else{
			d1=d1.replace(/-/g,"");
			d1=d1.replace(/ /,"");
			startTime=d1.replace(/:/,"");
			d2=d2.replace(/-/g,"");
			d2=d2.replace(/ /,"");
			endTime=d2.replace(/:/,"");
		}
	}
	else {
	   var	ds = d.getFullYear()+ "-"+addZero((d.getMonth() +1)) + "-"+addZero(d.getDate()-1)+ " "+addZero(d.getHours()-1)+ ":"+addZero(d.getMinutes()-5);

	    ds=ds.replace(/-/g,"");
			ds=ds.replace(/ /,"");
			startTime=ds.replace(/:/,"");	
	  dn=dn.replace(/-/g,"");
			dn=dn.replace(/ /,"");
			endTime=dn.replace(/:/,"");		
	}
	return{s:startTime,e:endTime};
}

function addZero(value){
    if(value < 10 ){
		value = "0" + value;
	}
	return value;
 }
 
//地图模式精炼选择
function refine(){
		//运营商
		var str=document.getElementsByName("operator");
		var operator="";
		for (i=0;i<str.length;i++)
		{
  			if(str[i].checked == true)
 		 {
   			operator+=str[i].value+" ";
 		 }
		}
		
		//通信技术
		var str=document.getElementsByName("signal");
		var signal="";
		for (i=0;i<str.length;i++)
		{
  			if(str[i].checked == true)
  			{
   			  signal=str[i].value;
  			}
		}
		
		return{o:operator,s:signal};	
	}
 	
   
//个人轨迹重置函数
function clearsearch()	
{ 
	document.getElementById("startTimeU").value="";
	document.getElementById("endTimeU").value="";
	document.getElementById("idValue").value="";
	document.getElementById("idType").value="userID";
	
}
//全选，这个可以先不看，有点难
$(function(){
	  	var str=document.getElementsByName("chkAll");
        $("INPUT[name='chkAll']").on('ifClicked', function(event){
			//alert("selectall")
			if(str[0].checked!=true){
					$("INPUT[name='userlist']").iCheck('check');
   			}
   			else {
					$("INPUT[name='userlist']").iCheck('uncheck');
			}
		});
	   
	 	$("INPUT[name='userlist']").on('ifChanged', function(event){
			var stru=document.getElementsByName("userlist");
			if(str[0].checked==true){
			 $("INPUT[name='chkAll']").iCheck('uncheck');
			}
			var usernum=0;
			for (var i=0;i<stru.length;i++){
  				if(stru[i].checked == true){
   			  		usernum++;
  				}
			}
			
		    if(usernum==stru.length){ 
			 $("INPUT[name='chkAll']").iCheck('check');
		    }
	 });
})