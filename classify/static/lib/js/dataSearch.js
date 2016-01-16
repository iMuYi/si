// JavaScript Document
//切换功能
function switchItem(tag){
   var s1 = document.getElementById('usersearch');
   var s2 = document.getElementById('areasearch');
   if(tag=='user'){
    s1.style.display = 'block';
    s2.style.display = 'none';
	document.getElementById("longitude").value="";
	document.getElementById("latitude").value="";
	document.getElementById("long").value="";
	
   }
   else{
    s1.style.display = 'none';
    s2.style.display = 'block';
	document.getElementById("idType").value="";
	document.getElementById("idValue").value="";	
   }
  }
  
//表格
function drawtable()
{ 
    //时间 
	var ret=getHisTime();
	var startTime=ret.s;
	var endTime=ret.e;	
		
	var radios = document.getElementsByName("radio");
	var tag = false;
	var val;
	for(radio in radios) {
   	  if(radios[radio].checked) {
      	val = radios[radio].value;
        break;
  	  }
	}
	if(val=="user") {
  	  var s3=document.getElementById('showchart');
	  s3.style.display = 'block';
	} 
		
		
	var idType=document.getElementById("idType").value;//userID,phonenum,IMEI 三种
	var idValue=document.getElementById("idValue").value;
		
	var longitude=document.getElementById("longitude").value;//userID,phonenum,IMEI 三种
	var latitude=document.getElementById("latitude").value;
	var long=document.getElementById("long").value;//userID,phonenum,IMEI 三种
	
    var i, imax, shtml;
    $.post("/classify/getSignalInfo/",
	   {"startTime":startTime,
	   	"endTime":endTime,
		"idType":idType,
		"idValue":idValue,		
	    "longitude":longitude,
		"latitude":latitude,
		"long":long,
		},function(data, status) {
          var obj = jQuery.parseJSON(data);	  
		  var irowmax = obj.data.length;
 		  if (irowmax < 1) {
          alert ("未查询到数据");
          return;
          }
         var cols = new Array();
         for (var key in obj.data[0]) { 
         cols[cols.length] = key;
         }
 
         icolmax = cols.length
 
         shtml = "<table border=1><tr>";          //create header row - save html of table in shtml
         for (i=0;i<icolmax;i++) {
         shtml += "<th>" + cols[i] + "</th>";
         }
         shtml += "</tr>";
 
         for (irow = 0; irow < irowmax; irow++) {  //add the rows
            shtml += "<tr>";
            for (i=0;i<icolmax;i++) {
              shtml += "<td>" + obj.data[irow][cols[i]] + "</td>";
           }
           shtml += "</tr>";
        }
 
       document.getElementById('myTable').innerHTML = shtml;   
});
}

function getHisTime(){
	    var d1=document.getElementById("startTime").value;
		var d2=document.getElementById("endTime").value;
  		var	d = new Date();
  		var	dn = d.getFullYear()+ "-"+addZero((d.getMonth() + 1)) + "-"+addZero(d.getDate())+ " "+addZero(d.getHours())+ ":"+addZero(d.getMinutes());//+addZero(d.getSeconds());//当前时间
		if(d1&&d2!="")
		{	if(d1>dn||d2>dn){
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
				return{s:startTime,e:endTime};
				}
			
		}
		else {
	   alert("请输入时间")
		}	
		//alert(startTime +"到" +endTime);		
}
  function addZero(value){
	if(value < 10 ){
		value = "0" + value;
	}
	return value;
 }
 
 function showLineChart(){
		  //时间 
	var ret=getHisTime();
	var startTime=ret.s;
	var endTime=ret.e;	
	var idType=document.getElementById("idType").value;//userID,phonenum,IMEI 三种
	var idValue=document.getElementById("idValue").value;
	
	 $.post("/classify/getSignalInfo/",
	   {"startTime":startTime,
	   	"endTime":endTime,
		"idType":idType,
		"idValue":idValue,		
		},function(data, status) {
		var chart = new iChart.LineBasic2D({
			render : 'linechart',
			data: data,
			align:'center',
			title : {
				text:'传输速率变化图',
				fontsize:24,
				color:'#f7f7f7'
			},
			width : 800,
			height : 400,
			shadow:true,
			shadow_color : '#20262f',
			shadow_blur : 4,
			shadow_offsetx : 0,
			shadow_offsety : 2,
			background_color:'#383e46',
			tip:{
				enable:true,
				shadow:true
			},
			crosshair:{
				enable:true,
				line_color:'#62bce9'
			},
			sub_option : {
				label:false,
				hollow_inside:false,
				point_size:8
			},
			coordinate:{
				width:640,
				height:260,
				grid_color:'#cccccc',
				axis:{
					color:'#cccccc',
					width:[0,0,2,2]
				},
				grids:{
					vertical:{
						way:'share_alike',
				 		value:5
					}
				},
				scale:[{
					 position:'left',	
					 start_scale:0,
					 end_scale:100,
					 scale_space:10,
					 scale_size:2,
					 label : {color:'#ffffff',fontsize:11},
					 scale_color:'#9f9f9f'
				},{
					 position:'bottom',	
					 label : {color:'#ffffff',fontsize:11},
					 labels:labels
				}]
			}
		});
		
		//开始画图
		chart.draw();
	});
 }
	