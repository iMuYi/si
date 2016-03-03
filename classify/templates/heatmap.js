
 $('#heatmapBut').click(function(){
		var ref=refine();//获取运营商等选择的函数，action.js中
		var operator=ref.o;
		var signal=ref.s;
		var idValue=ref.u;//被选中的用户
	    var ret=getHisTime();//获取时间函数，action.js中
		var startTime=ret.s;
	    var endTime=ret.e;
	var points= [];
	 $.post("/classify/getSignalInfo/",
					{"startTime":startTime,
					 "endTime":endTime,
					 "operator":operator,
					 "signal":signal,
					 "idValue":idValue,
					},function(data, status) {
						 var obj = jQuery.parseJSON(data);
						 //obj={data:[{"lat":39.96942, "lng":116.36214, "count":"100"}, {"lat":39.96942, "lng":116.36229, "count":"100"}, {"lat":39.96942, "lng":116.36244, "count":"100"} ]}
						 
						 for(var i=0;i<obj.data.length;i++){
							points.push({"lng":obj.data[i].Longitude,"lat":obj.data[i].Latitude,"count":-obj.data[i].RSRP})
							//points.push({"lng":obj.data[i].lng,"lat":obj.data[i].lat,"count":obj.data[i].count})
						 }
					});
   
    if(!isSupportCanvas()){
    	alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
    }
	//详细的参数,可以查看heatmap.js的文档 https://github.com/pa7/heatmap.js/blob/master/README.md
	//参数说明如下:
	/* visible 热力图是否显示,默认为true
     * opacity 热力的透明度,1-100
     * radius 势力图的每个点的半径大小   
     * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
     *	{
			.2:'rgb(0, 255, 255)',
			.5:'rgb(0, 110, 255)',
			.8:'rgb(100, 0, 255)'
		}
		其中 key 表示插值的位置, 0~1. 
		    value 为颜色值. 
     */
	heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":30});
	map.addOverlay(heatmapOverlay);
	heatmapOverlay.setDataSet({data:points,max:110});
        heatmapOverlay.show();
	 
 } ); 
 //修改渐变样式的函数，暂时没用
   function setGradient(){
     	/*格式如下所示:
		{
	  		0:'rgb(102, 255, 0)',
	 	 	.5:'rgb(255, 170, 0)',
		  	1:'rgb(255, 0, 0)'
		}*/
     	var gradient = {};
     	var colors = document.querySelectorAll("input[type='color']");
     	colors = [].slice.call(colors,0);
     	colors.forEach(function(ele){
			gradient[ele.getAttribute("data-key")] = ele.value; 
     	});
        heatmapOverlay.setOptions({"gradient":gradient});
    }
	//判断浏览区是否支持canvas
    function isSupportCanvas(){
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }