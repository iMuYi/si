// JavaScript Document
	//地图初始化
    var map = new BMap.Map("allmap",{minZoom:18,maxZoom:19});          // 创建地图实例
    var pt_center = new BMap.Point(116.364756, 39.969198);
    map.centerAndZoom(pt_center,19 );             // 初始化地图，设置中心点坐标和地图级别
    map.disableScrollWheelZoom(); // 不允许滚轮缩放
    var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
	var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
	map.addControl(top_left_control);  //添加控件和比例尺
	map.addControl(top_left_navigation);
	
	
  
	var j=0;
    var TimeID=null;
	
	function  Bpoint(Longitude,Latitude) //声明对象
     {    
        this.Latitude= Latitude; 
		this.Longitude = Longitude;
     }
	var lonlat=new Array();
	lonlat.push(new Bpoint(116.363419, 39.970383),new Bpoint(116.362642, 39.968984),new Bpoint(116.36699, 39.969637),new Bpoint(116.365332, 39.970335),new Bpoint(116.363302, 39.969775),new Bpoint(116.365463, 39.969246))
	//分次显示的函数
	function getMove()
    {   
	    j = 0
	    window.clearInterval(TimeID);
		var str=document.getElementById("EntTime").value;
		//alert(str.value)
		var startDate=str.slice(0,4)+str.slice(5,7)+str.slice(8,10)+"000000000";
		alert(startDate);
				$.post("/classify/userMove/",{
					"startDate":startDate,
				},function(data, status) {
					var obj = jQuery.parseJSON(data);
					alert('getData')
					map.clearOverlays();
					window.clearInterval(TimeID);
					TimeID = window.setInterval(function(){delay(obj);}, 1000);
	    	     });
		}
	
		
	 var movei=0;
     var moveTime=null;
	
	function delay(data){
		var locNum=6;
		//alert(data.userNum.length)
		if(j<data.userNum.length) {
			map.clearOverlays();
			length="24px"
			for (var i=0;i<locNum;i++){	

					var myLabel = new BMap.Label("<p>"+data.userNum[j][i]+"</p>",     //为lable填写内容
					{position: new BMap.Point(lonlat[i].Longitude,lonlat[i].Latitude)});           //label的位置
					myLabel.setStyle({       //给label设置样式，任意的CSS都是可以的
						height:length ,                //高度
						width:length,                 //宽
						borderRadius:"12px",
						opacity:"0.8",			//透明度
						border:"0", 
						color:"black",
						fontSize:"22px",               //字号
						 //fontWeight:"bold",
						textAlign:"center",            //文字水平居中显示
						lineHeight:"20px",            //行高，文字垂直居中显示
					});
					//myLabel.setStyle({background:"#0099CC", });		
					var a0=5,a1=15,a2=25,a3=35  														
					//根据信号强度不同设置不同颜色							
					if(data.userNum[j][i]<=a0){ 
						myLabel.setStyle({background:"#006699", }); 
					}
					else if(data.userNum[j][i]<=a1) {   
						myLabel.setStyle({background:"#339933",});    
					}
					else if(data.userNum[j][i]<=a2) {   	
						myLabel.setStyle({background:"#FFFF00",});          					
					}
					else if(data.userNum[j][i]<=a3) {   
						myLabel.setStyle({background:"#FF6600",});                			
					}
					else  {   
						myLabel.setStyle({background:"red",});                 			
					}
					map.addOverlay(myLabel);
					
					if(j==data.userNum.length-1){
					var jj=j-1}else{var jj=j}			
					lon=0.00015/32*12;
					lat=0.00011/32*12;	
					for(var k=0;k<6;k++){
						if(data.userMoveList[jj][i][k]!=0){
							var polyline = new BMap.Polyline([
								new BMap.Point(lonlat[i].Longitude+lon, lonlat[i].Latitude-lat),new BMap.Point(lonlat[k].Longitude+lon, lonlat[k].Latitude-lat)
								], {strokeColor:"#FFCC00", strokeWeight:3, strokeOpacity:0.8});
								map.addOverlay(polyline);
		
						}
					}				

			}
			window.clearInterval(moveTime);
			//alert(data.userMoveList[j])
			moveTime= window.setInterval(function(){delayMove(data.userMoveList[j-1]);}, 100);
			j++;
        }
        else
        { 
           alert('end');
           j = 0;
           window.clearInterval(TimeID);
           movei=0;
		   window.clearInterval(moveTime);
         }	
    }
	
	var moveMarker=new Array();
	 function delayMove(data){
		var movei_max=8;
		lon=0.00015/32*12;
		lat=0.00011/32*12;	
		if(movei<movei_max){
			var markerNum=0;
			for(var i=0;i<6;i++){
				for(var k=0;k<6;k++){ 
					if(data[i][k]!=0){								  
						map.removeOverlay(moveMarker[markerNum]);		
						var d_lon=(lonlat[k].Longitude-lonlat[i].Longitude)/movei_max*(movei+1);
						var d_lat=(lonlat[k].Latitude-lonlat[i].Latitude)/movei_max*(movei+1);
						var marker= new BMap.Label("<p>"+data[i][k]+"</p>",     //为lable填写内容
						{		
							offset:new BMap.Size(-16,-16),                  //label的偏移量，为了让label的中心显示在点上
							position:new BMap.Point(lonlat[i].Longitude+lon+d_lon,lonlat[i].Latitude-lat+d_lat)});                                //label的位置
						marker.setStyle({                                   //给label设置样式，任意的CSS都是可以的
							fontSize:"14px",               //字号
							border:"0",                    //边
							height:"25px",                //高度
							width:"25px",                 //宽
							textAlign:"center",            //文字水平居中显示
							//lineHeight:"20px",            //行高，文字垂直居中显示
							background:"url(/static/lib/img/marker.png)",    //背景图片
							color:"blue",
							fontWeight:"bold",
						});
						moveMarker[markerNum]=marker;
						markerNum++;
						map.addOverlay(marker);	
					}
				}
			}
			movei++;
		}else{
			var markerNum=0;
			for(var i=0;i<6;i++){
				for(var k=0;k<6;k++){ 
					if(data[i][k]!=0){
						//alert(markerNum);						
						map.removeOverlay(moveMarker[markerNum]);
						markerNum++;
					}
					
				}
			}
			movei=0;
			window.clearInterval(moveTime);
		}
	}	
	//getMove()
	
	
	
	