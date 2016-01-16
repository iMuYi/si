// JavaScript Document
//地图初始化

function close_show()
	   {
		    document.all.div_show.style.display="none";
		    document.all.cover.style.display="none";    
			map.addEventListener("tilesloaded", chooseMode);
			map1.removeEventListener("tilesloaded", antiShake);
	   }
  var map1 = new BMap.Map("mapDiv1");
  map1.centerAndZoom(new BMap.Point(116.361757,39.968524),19);
  map1.enableScrollWheelZoom();
  var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
  var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
  map1.addControl(top_left_control);  //添加控件和比例尺
  map1.addControl(top_left_navigation);

  var map2 = new BMap.Map("mapDiv2"); //设置卫星图为底图
  map2.centerAndZoom(new BMap.Point(116.361757,39.968524),19);
  map2.disableScrollWheelZoom();

function getOperatorNum()
{
  var str=document.getElementsByName("operator");
		var operatorNum=0;
		for (i=0;i<str.length;i++)
		{
  			if(str[i].checked == true)
 		 {
   			operatorNum++;
 		 }
		}
		return operatorNum;
}
  

  map1.addEventListener("zoomend", function () {
    map2.zoomTo(map1.getZoom());
    map2.panTo(map1.getCenter());
  });
  map1.addEventListener("moveend", function () {
    map2.zoomTo(map1.getZoom());
    map2.panTo(map1.getCenter());
  }); 
 	
	var map3;
	function showmap(){ 
	     document.all.div_show.style.display="block";
		 document.all.cover.style.display="block"; 
		 $("#ope_name1").html("");
		 $("#ope_name2").html("");
		 $("#ope_name3").html("");
		 var str=document.getElementsByName("operator"); 
	        if(getOperatorNum()==3&&document.getElementById("mapDiv3")==null){
		
          	alert("div3");
    		$("#mapDiv1").after("<div id='mapDiv3'></div> ");
			$("#mapDiv1").before("<div id='ope_name3'></div> ");
			$("#ope_name1").append(str[0].value);
			$("#ope_name2").append(str[1].value);
			$("#ope_name3").append(str[2].value);
			map3= new BMap.Map("mapDiv3"); 
   			map3.centerAndZoom(new BMap.Point(116.361757,39.968524),19);
    		map3.disableScrollWheelZoom();
    		mapDiv1.style.width="32%";
    		mapDiv2.style.width="32%";
			map1.addEventListener("zoomend", function () {
				map3.zoomTo(map1.getZoom());
				map3.panTo(map1.getCenter());
		  	});
		 	 map1.addEventListener("moveend", function () {
				map3.zoomTo(map1.getZoom());
				map3.panTo(map1.getCenter());
  			});
		}
  		
		else if (getOperatorNum()==2){
			if(document.getElementById("mapDiv3")!=null){
				$('#mapDiv3').remove();
				$("#ope_name3").remove();
			    mapDiv1.style.width="48%";
    		    mapDiv2.style.width="48%";
			}
			var ope="";
			for (i=0;i<str.length;i++)
		{
  			if(str[i].checked == true)
 		 {
   			ope+=str[i].value+" ";
			
 		 }
		}
		alert(ope);
		var opename=[];
		var opename= ope.split(" ");
		 $("#ope_name1").append(opename[0]);
		 $("#ope_name2").append(opename[1]);
				}
	   //alert(getOperatorNum());
		map.removeEventListener("tilesloaded", chooseMode);
		map1.addEventListener("tilesloaded", antiShake);
		 
				 antiShake();
	} 
function antiShake()
{
	delay_till_last('id1', compareData, 1000);
	//compareData();
}
/*
 function  signal(Longitude,Latitude,RSRP) //声明对象
     {
        this.Longitude = Longitude;
        this.Latitude= Latitude;
        this.RSRP= RSRP;
     }	
		var data1=new Array();
	var data2=new Array();
	var data3=new Array();


function compareData()
	{ 
	 alert("compareData")

   data1.push(new signal(116.361757,39.968524,-110));
    data1.push(new signal(116.361790,39.968524,-110));
	data2.push(new signal(116.361857,39.968524,-96));
	  data2.push(new signal(116.361710,39.968524,-110));
	data3.push(new signal(116.361757,39.968524,-76));
       //  document.all.show.style.display="block";  
		 				 map1.clearOverlays();
						map2.clearOverlays();
		  				for(var i=0;i<data1.length;i++){					
 							map1.addOverlay(setLable(data1[i]));
		  					};
						for(var i=0;i<data2.length;i++){					
 							map2.addOverlay(setLable(data2[i]));
		  					}; 
						if(getOperatorNum()==3){
						   // map3.clearOverlays();
						    for(var i=0;i<data3.length;i++){					
 							  map3.addOverlay(setLable(data3[i]));
		  					};
						}
		 
	}
	*/
	
	function compareData(){
		
	//获取地图可视区域
				alert("compareData")
				var ret=getHisTime();
				var startTime=ret.s;
				var endTime=ret.e;
				//alert(startTime+"dao"+endTime)
				var ref=refine();
				var operator=ref.o;
				var signal=ref.s;
        		var bs = map1.getBounds();   //获取可视区域
	    		var bssw = bs.getSouthWest();   //可视区域左下角
	    		var bsne = bs.getNorthEast();   //可视区域右上角
	    		var lng1 = bssw.lng
	    		var lat1 = bssw.lat
	    		var lng2 = bsne.lng
        		var lat2 = bsne.lat
				var zoomis=map1.getZoom();
	//将下面的数据传给服务器
				$.post("/classify/getCompareInfo/",
	   				{"startTime":startTime,
	   				"endTime":endTime,
					"zoom":zoomis,
					"lng1":lng1,		//bssw.lng,bssw.lat
	    			"lng2":lng2,
					"lat1":lat1,
					"lat2":lat2,
					"operator":operator,
					"signal":signal,
					},function(data, status) {
          				var obj = jQuery.parseJSON(data);
	//服务器返回相应的数据，处理添加到地图上

		  				map1.clearOverlays();
						map2.clearOverlays();
		  				for(var i=0;i<obj.data1.length;i++){					
 							map1.addOverlay(setLable(obj.data1[i]));
		  					};
						for(var i=0;i<obj.data2.length;i++){					
 							map2.addOverlay(setLable(obj.data2[i]));
		  					}; 
						if(getOperatorNum()==3){
						    map3.clearOverlays();
						    for(var i=0;i<obj.data3.length;i++){					
 							  map3.addOverlay(setLable(obj.data3[i]));
		  					};
						}
	    			});
					
	}
	
	function setLable(data)
	{	//alert("2");
	var length="";
	var zoomis=map1.getZoom();
	    		switch(zoomis)
	    		{case 19:
		    		length="32px";
		    		break;
	    		case 18:
		    		length="16px";
		    		break;
	    		case 17:
		    		length="16px";
		    		break;
	    		case 16:
		    		length="8px";
		    		break;
	    		case 15:
		    		length="8px";
		   		    break;
		 		}	
	   var myLabel = new BMap.Label("",     //为lable填写内容
               		   {position:new BMap.Point(data.Longitude,data.Latitude)});           //label的位置
					    myLabel.setStyle({       //给label设置样式，任意的CSS都是可以的
  		    		        height:length ,                //高度
    				        width:length,                 //宽
					        opacity:"0.4",			//透明度
					        border:"0",
					        });	
							var str=document.getElementsByName("signal");
							var signal="";
							for (var i=0;i<str.length;i++)
							{
								if(str[i].checked == true)
								{
								  signal=str[i].value;
								}
							}
							if(signal=="RSRP"){
								var a0=-105,a1=-95,a2=-85,a3=-75,a4=-65;	
							}
							else{
								var a0=10,a1=100,a2=500,a3=1000,a4=3000;
							}
							 if(data.RSRP<=a0){color="red";myLabel.setStyle({background:"red", });}
								else if(data.RSRP<=a1) {myLabel.setStyle({background:"#FF6600", }); }
								else if(data.RSRP<=a2) {myLabel.setStyle({background:"#FFFF00", }); }
								else if(data.RSRP<=a3) {myLabel.setStyle({background:"#339933", }); }
								else if(data.RSRP<=a4) {myLabel.setStyle({background:"#0099CC", }); }
								else {color="#006699";myLabel.setStyle({background:"#006699", });}
							return myLabel;
	}
	
	
