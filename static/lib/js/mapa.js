// JavaScript Document 这个也是为了保持通信的，可以不看
  $(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});

//初始化，前边几句都是调用百度地图API的，按照人家百度给的写的
    var map = new BMap.Map("allmap",{minZoom:15,maxZoom:19});          // 创建地图实例
    var pt_center = new BMap.Point(116.365247,39.969982);
    map.centerAndZoom(pt_center,19 );             // 初始化地图，设置中心点坐标和地图级别
    map.disableScrollWheelZoom(); // 允许滚轮缩放
    var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
	var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
	map.addControl(top_left_control);  //添加控件和比例尺
	map.addControl(top_left_navigation);
	//从这里开始执行主程序
	var j=0;
    var timeID=null;
	//var info = document.getElementById("getinfo");
	var timing;
	lng1=""
	lat1=""
	lng2=""
    lat2=""
    //这是获取数据的函数
	function getData()
    		{	j = 0;
    			window.clearInterval(timeID);//清楚计时器，因为我后边用到了计时，所以这里要初始化，清除别的计时器对他的影响
				var usersStyle=document.all.users.style.display;
				var showStyle=document.all.div_show.style.display;
				
				if(usersStyle=="block"||showStyle=="block"){
					 return; 
   				}	
				//alert('getData');
	    		var zoomis=map.getZoom();

	    		var length="";
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

	//获取地图可视区域
				var ret=getHisTime();//看名字就知道是获取时间函数，在别的js里边
				var startTime=ret.s;
				var endTime=ret.e;
				//alert(startTime+"dao"+endTime)
				var ref=refine();//获取运营商的函数，恩，也是自己写的，就跟上边获取时间一样理解就好
				var operator=ref.o;
				var signal=ref.s;
        		
				
				var chartClass=$("#panel-474648").attr("class");
				var mapClass=$("#panel-855772").attr("class");
	//将下面的数据传给服务器
			 if(mapClass=="tab-pane active"){
				var bs = map.getBounds();   //获取可视区域
	    		var bssw = bs.getSouthWest();   //可视区域左下角
	    		var bsne = bs.getNorthEast();   //可视区域右上角
	    		 lng1 = bssw.lng
	    		 lat1 = bssw.lat
	    		 lng2 = bsne.lng
        		 lat2 = bsne.lat
				// alert("map"+lng1+"到"+lng2+"纬度"+lat1+"到"+lat2)
				//下面是ajax，跟后台通信的。具体的格式为  $.post(url,data,function),最后的function里边写的是跟后台通信返回后执行的语句。
					$.post("/classify/getSignalInfo/",
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
							map.clearOverlays();
							//下面是for循环绘制地图，不用看的太懂，因为很多都是百度地图api的东西
							for(var i=0;i<obj.data.length;i++){
								var myLabel = new BMap.Label("",     //为lable填写内容
								{position:new BMap.Point(obj.data[i].Longitude,obj.data[i].Latitude)});           //label的位置
									myLabel.setStyle({       //给label设置样式，任意的CSS都是可以的
									height:length ,                //高度
									width:length,                 //宽
									opacity:"0.4",			//透明度
									border:"0",
									});
								//根据信号强度不同设置不同颜色
							
						        if(signal=="RSRP"){
									var a0=-105,a1=-95,a2=-85,a3=-75,a4=-65;
									$(".legend").html("");		//这是动态添加
									$(".legend").append("<p><div class='coloris' style='background-color:#006699;'></div>≥-64dBm</p><p><div class='coloris' style='background-color:#0099CC;'></div>-74~-65dBm</p><p><div class='coloris' style='background-color:#339933;'></div>-84~-75dBm</p><p><div class='coloris' style='background-color:#FFFF00;'></div>-94~-85dBm</p><p><div class='coloris' style='background-color:#FF6600;'></div>-104~-95dBm</p><p><div class='coloris' style='background-color:red;'></div>≤-105dBm</p>")
								}
								else{
									var a0=10,a1=100,a2=500,a3=1000,a4=3000;
									$(".legend").html("");
									$(".legend").append("<p><div class='coloris' style='background-color:#006699;'></div>≥3Mbps</p><p><div class='coloris' style='background-color:#0099CC;'></div>1~3Mbps</p><p><div class='coloris' style='background-color:#339933;'></div>500~1000Kbps</p><p><div class='coloris' style='background-color:#FFFF00;'></div>100~500Kbps</p><p><div class='coloris' style='background-color:#FF6600;'></div>10~100Kbps</p><p><div class='coloris' style='background-color:red;'></div>≤10Kbps</p>")
								}
							
								if(obj.data[i].RSRP<=a0){ 
									myLabel.setStyle({background:"red", }); 
								}
								else if(obj.data[i].RSRP<=a1) {   
									myLabel.setStyle({background:"#FF6600",});    
								}
								else if(obj.data[i].RSRP<=a2) {   	
									myLabel.setStyle({background:"#FFFF00",});          					
								}
								else if(obj.data[i].RSRP<=a3) {   
									myLabel.setStyle({background:"#339933",});                			
								}
								else if(obj.data[i].RSRP<=a4) {   
									myLabel.setStyle({background:"#0099CC",});   										           					
								}
								else  {   
									myLabel.setStyle({background:"#006699",});                 			
								}
								myLabel.setTitle(obj.data[i].peopleNum);  
								map.addOverlay(myLabel);
							};
							
							$("#rsrpshow").html("")
							$("#txshow").html("")
  			   				$("#rxshow").html("")
							var str=document.getElementsByName("operator");
							for (i=0;i<str.length;i++)
							{
  								if(str[i].checked == true)
 		 						{
 		 							alert(obj.meanRSRP[i])
   									$("#rsrpshow").append("<p>&nbsp;&nbsp;"+str[i].value+":"+obj.meanRSRP[i]+"</p>")
									$("#txshow").append("<p>&nbsp;&nbsp;"+str[i].value+":"+obj.meanTx[i]+"</p>")
									$("#rxshow").append("<p>&nbsp;&nbsp;"+str[i].value+":"+obj.meanRx[i]+"</p>")
 								}
							}
	    			   });
			    }		
				if(chartClass=="tab-pane active"){
					//alert("chart"+lng1+"到"+lng2+"纬度"+lat1+"到"+lat2)
					//又一个与后台通信
					$.post("/classify/getFlotInfo/",
						{"startTime":startTime,
						"endTime":endTime,
						"lng1":lng1,		//bssw.lng,bssw.lat
						"lng2":lng2,
						"lat1":lat1,
						"lat2":lat2,
						},function(data, status) {
							
							var obj = jQuery.parseJSON(data);
							for(var i=0;i<obj.TIME.length;i++){
								if(obj.ChinaMobile[i]==0){
									obj.ChinaMobile[i]=null;
								}
								if(obj.Unicom[i]==0){
									obj.Unicom[i]=null;
								}
								if(obj.Telcom[i]==0){
									obj.Telcom[i]=null;
								}
							}
							
							//绘制折线图，从网上查的，并不需要记住，到时候会查会写就好
							var ctxL = document.getElementById('myLineChart').getContext("2d")
							var DataL = {
           						 labels:obj.TIME,
           						 datasets: [{
               					 label: "ChinaMobile",
               					 fillColor: "rgba(220,220,220,0.2)",
                				 strokeColor: "rgba(0,102,51,1)",
               					 pointColor: "#339933",
                				 pointStrokeColor: "rgba(220,220,220,1)",
                 				 data: obj.ChinaMobile,
            					},
			   					{
                    			 label: "Unicom",
               					 fillColor: "rgba(220,220,220,0.2)",
               					 strokeColor: "#993333",
             	    			 pointColor: "#993333",
               					 pointStrokeColor: "rgba(220,220,220,1)",
           						 data: obj.Unicom,
      			 				},
				 				{
           						 label: "Telcom",
                				 fillColor: "rgba(220,220,220,0.2)",
                 				 strokeColor: "#006699",
                  				 pointColor: "#006699",
               					 pointStrokeColor: "rgba(220,220,220,1)",
           						 data: obj.Telcom,
       			 				}]
	        				  };
        					var lineChart = new Chart(ctxL).Line(DataL, {
            					bezierCurveTension: 0,
            					bezierCurve: false,
            					scaleOverride: true,
            					scaleSteps: 12,
           						scaleStepWidth: 10,
            					scaleStartValue: -120,
			 					animation : false,
			 					scaleGridLineColor : "#CCCCCC",
        					});
							
							//绘制柱状图
							var ctxB= document.getElementById('myBarChart').getContext("2d")
							var dataB = {
            					labels:obj.TIME,
            					datasets: [{
                				 label: "ChinaMobile",
                				 fillColor: "#339933",
                				 strokeColor: "#339933",
                				 data: obj.ChinaMobile,
								},
								{
                				 label: "Unicom",
                				 fillColor: "#993333",
                				 strokeColor: "#993333",
                				 data:obj.Unicom,
								},
								{
                				 label: "Telcom",
               					 fillColor: "#006699",
               					 strokeColor: "#006699",
               					 data:obj.Telcom,
								},]
        					};
							 var barChart = new Chart(ctxB).Bar(dataB, {
								 scaleOverride : true,
								 scaleSteps : 12,
								 scaleStepWidth : 10,
								 scaleStartValue : -120,
							 });
							 //绘制饼状图
							 var ctxP = document.getElementById('myPieChart').getContext("2d")	
 							 var dataP=[{
										value: obj.CN,
										color:"#339933"
										},
										{
										value : obj.UN,
										color : "#993333"
										},
										{
										value : obj.TN,
										color : "#006699"
										}]
							var pieChart=new Chart(ctxP).Pie(dataP,{animateRotate:true,});							
						});
	    			}
				
				//每600000毫秒执行一次getData()
				var d1=document.getElementById("startTime").value;
				var d2=document.getElementById("endTime").value;
				usersStyle=document.all.users.style.display;
				showStyle=document.all.div_show.style.display;
				if(usersStyle!="block"&&showStyle!="block"&&!(d1!=""&&d2!=="")){
	 				timing=setTimeout("getData()",600000);
   				}	
				else{
	  				 clearTimeout(timing); 
    			}
			
           }
		   
		   
		   
    function showUser() {
		if(document.all.users.style.display=="block"){$("#users").html("");}
	    else{       //alert('showuser')
	            j = 0;
	            window.clearInterval(timeID);
	            var ret=getHisTime();
				var startTime=ret.s;
				var endTime=ret.e;
				//alert(startTime+"dao"+endTime)
				var ref=refine();
				var operator=ref.o;
				var signal=ref.s;
        		var bs = map.getBounds();   //获取可视区域
	    		var bssw = bs.getSouthWest();   //可视区域左下角
	    		var bsne = bs.getNorthEast();   //可视区域右上角
	    		var lng1 = bssw.lng
	    		var lat1 = bssw.lat
	    		var lng2 = bsne.lng
        		var lat2 = bsne.lat
	            $.post("/classify/getUsers/",
	                {"startTime":startTime,
	   				"endTime":endTime,

					"lng1":lng1,		//bssw.lng,bssw.lat
	    			"lng2":lng2,
					"lat1":lat1,
					"lat2":lat2,
					"operator":operator,
					"signal":signal,
					},function(data, status) {
                    //获取 JSON 数据
        	         var items = jQuery.parseJSON(data).data;

         	        $.each(items, function (index, val) {
        	            $("#users").append("<li><a href='#'><input type='checkbox' name='userlist' value='"+val+"'  id='"+val+"'><label for='"+val+"'>"+val+"</label></a></li>");                      
                        }); 
						 $("#users").append("<li><a href='#'><input type='checkbox' name='chkAll' id='chkAll'><label for='chkAll' >Select All</label></a></li>")
						 $("#users").append("<li><button class='btn btn-primary' style='width:106px;' onclick='trackShow();'>Quickly Show</button><button class='btn btn-primary' style='width:108px;float:right;margin-right:65px;background-color:#F99;border-color:#F99;' onclick='userTrack();'>Slowly Show</button></li>");                      
       	            });
        }
    }
	 
	 
	 function trackShow()
    {   j = 0;
    	window.clearInterval(timeID);
	    var points=new Array();
		var str=document.getElementsByName("userlist");
		var userchecked="";
		for (var i=0;i<str.length;i++)
		{
  			if(str[i].checked == true)
  			{
   			  userchecked+=str[i].value+" ";
  			}
		}
			var ret=getHisTime();
    		var startTime=ret.s;
			var endTime=ret.e;
	//alert(startTime+"dao"+endTime)
   		 	var idValue=userchecked;//被选中的用户名
    //alert(idValue);
    		var ref=refine();
    		var signal=ref.s;
			$.post("/classify/getUserInfo/",{"idValue":idValue,"signal":signal,"startTime":startTime,"endTime":endTime},function(data, status) {
 				var obj = jQuery.parseJSON(data);
	        //服务器返回相应的数据，处理添加到地图上
				for (var i=0;i<obj.data.length;i++){
	 				for(var k=0;k<obj.data[i].length;k++){
		 				points.push(new BMap.Point(obj.data[i][k].Longitude,obj.data[i][k].Latitude));
	 				}
				}
				map.clearOverlays();
				map.setViewport(points);
		  
			  for (var i=0;i<obj.data.length;i++){
	 				for(var k=0;k<obj.data[i].length-1;k++){
              //  alert(obj.data[i][j].RSRP)
						getTrack(i,k,obj.data);
						getLab(obj.data[i][k]);
			  			if(k==obj.data[i].length-2){
			   				getLab(obj.data[i][k+1])
			  			}
					}
			  }
          });
	}
	 
	 

	function userTrack()
    {   
	    j = 0
	    window.clearInterval(timeID);
	    var points=new Array();
		var str=document.getElementsByName("userlist");
		var userchecked="";
		for (var i=0;i<str.length;i++)
		{
  			if(str[i].checked == true)
  			{
   			  userchecked+=str[i].value+" ";
  			}
		}
			var ret=getHisTime();
    		var startTime=ret.s;
			var endTime=ret.e;
	//alert(startTime+"dao"+endTime)
   		 	var idValue=userchecked;//被选中的用户名
   		 	var ref=refine();
   		 	var signal=ref.s;
    //alert(idValue);
			$.post("/classify/getUserInfo/",{"idValue":idValue,"signal":signal,"startTime":startTime,"endTime":endTime},function(data, status) {
 				var obj = jQuery.parseJSON(data);
	        //服务器返回相应的数据，处理添加到地图上
				for (var i=0;i<obj.data.length;i++){
	 				for(var k=0;k<obj.data[i].length;k++){
		 				points.push(new BMap.Point(obj.data[i][k].Longitude,obj.data[i][k].Latitude));
	 				}
				}
				map.clearOverlays();
				map.setViewport(points);
		    	display(obj.data);
	    	});
	
    }
	
	
	
	 function display(data)
        { 
          window.clearInterval(timeID);
          timeID = window.setInterval(function(){delay(data);}, 100);
        }
	
		function delay(data)
        { 	  
           // alert("delay")
		   var maxj=0;
		   for (var k=0;k<data.length;k++){
		     if(maxj<data[k].length){
			    maxj=  data[k].length;		   
		     }
		   }
			if(j<maxj-1) {
			  for (var i=0;i<data.length;i++){
              //  alert(data[i][j].RSRP)
			  	if(j<data[i].length-1){ 
			   		getTrack(i,j,data)
					getLab(data[i][j])
				}
			  	if(j==data[i].length-2){
			   		getLab(data[i][j+1])
			  	}
			  }
			j++;
          }
          else
          { 
            alert('end');
            j = 0;
            window.clearInterval(timeID);
          }
      }
	  
	  function getTrack(i,k,data){	
	  			var str=document.getElementsByName("signal");
				var signal_tmp="";
				for (var h=0;h<str.length;h++)
				{
  					if(str[h].checked == true)
  					{
   			 			 signal_tmp=str[h].value;
  					}
				}
	  			if(signal_tmp=="RSRP"){
					var aa=-105,bb=-95,cc=-85,dd=-75,ee=-65;
				}
				else{
					var aa=10,bb=100,cc=500,dd=1000,ee=3000;
				}		
				if(data[i][k].RSRP<=aa){color="red";}
				else if(data[i][k].RSRP<=bb) {color="#FF6600"; }
				else if(data[i][k].RSRP<=cc) {color="#FFFF00"; }
				else if(data[i][k].RSRP<=dd) {color="#339933"; }
				else if(data[i][k].RSRP<=dd) {color="#0099CC"; }
				else {color="#006699";}
		  		jud=data[i][k+1].time-data[i][k].time
				judge=jud<200000
				lngjud = Math.abs(data[i][k+1].Longitude-data[i][k].Longitude);
				latjud = Math.abs(data[i][k+1].Latitude-data[i][k].Latitude);
				if (judge)
						{
							if ((lngjud>0.05) || (latjud>0.05))
								{
									alert('wrong');
									//var polyline = new BMap.Polyline([new BMap.Point(data[i][j].Longitude,data[i][j].Latitude), new BMap.Point(data[i][j].Longitude,data[i][j].Latitude)], {strokeColor:color, strokeWeight:6, strokeOpacity:0.7});
									//map.addOverlay(polyline);

								}
							else
								{

									var polyline = new BMap.Polyline([new BMap.Point(data[i][k].Longitude,data[i][k].Latitude), new BMap.Point(data[i][k+1].Longitude,data[i][k+1].Latitude)], {strokeColor:color, strokeWeight:6, strokeOpacity:0.7});
									map.addOverlay(polyline);
								}

						}
	  }
	  function getLab(data){
			 var lab = new BMap.Label("",{offset:new BMap.Size(-4,-4),   position:new BMap.Point(data.Longitude,data.Latitude)});
			 lab.setStyle({       
					        opacity:"0.4",			
						    height:"8px",
    				        width:"8px",
					        border:"0",
							borderRadius:"4px",
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
				var aa=-105,bb=-95,cc=-85,dd=-75,ee=-65;
			}
			else{
				var aa=10,bb=100,cc=500,dd=1000,ee=3000;
			}
			 if(data.RSRP<=aa){color="red";lab.setStyle({background:"red", });}
				else if(data.RSRP<=bb) {lab.setStyle({background:"#FF6600", }); }
				else if(data.RSRP<=cc) {lab.setStyle({background:"#FFFF00", }); }
				else if(data.RSRP<=dd) {lab.setStyle({background:"#339933", }); }
				else if(data.RSRP<=ee) {lab.setStyle({background:"#0099CC", }); }
				else {color="#006699";lab.setStyle({background:"#006699", });}
				lab.setTitle(data.RSRP);  	
		 		map.addOverlay(lab);
		}
	
	var _timer = {};
	function delay_till_last(id, fn, wait) {
   	 	if (_timer[id]) {
        	window.clearTimeout(_timer[id]);
       		delete _timer[id];
    	}
   		return _timer[id] = window.setTimeout(function() {
        	fn();
        	delete _timer[id];
    	}, wait);
	}
	function chooseMode()
    	{
       // alert('chooseMode');
        if (document.all.users.style.display=="block"){//alert('2');
            }
        else{
            //alert('3');		
			 delay_till_last('id', getData, 1000);       
            }
    }
   // alert('tilesloaded')
	map.addEventListener("tilesloaded", chooseMode);
	
	