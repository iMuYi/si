
 $('#heatmapBut').click(function(){
		var ref=refine();//获取运营商等选择的函数，action.js中
		var operator=ref.o;
		var signal=ref.s;
		var idValue=ref.u;//被选中的用户
	    var ret=getHisTime();//获取时间函数，action.js中
		var startTime=ret.s;
	    var endTime=ret.e;
	var points1= [];
	var points2=[];
	 $.post("/classify/getSignalInfo/",
					{"startTime":"2015110411112200000",//startTime,
					 "endTime":"2016010413112200000",
					 "operator":operator,
					 "signal":signal,
					 "idValue":idValue,
					},function(data, status) {
						 var obj = jQuery.parseJSON(data);
						 //obj={data:[{"lat":39.96942, "lng":116.36214, "count":"100"}, {"lat":39.96942, "lng":116.36229, "count":"100"}, {"lat":39.96942, "lng":116.36244, "count":"100"} ]}
						 map.clearOverlays();
						 for(var i=0;i<obj.data.length;i++){
							tmp = obj.data[i].RSRP
							tmp2 = parseFloat(tmp)
							tmp4 = -tmp2
							tmp3 = tmp2+120
							points1.push({"lng":obj.data[i].Longitude,"lat":obj.data[i].Latitude,"count":tmp3})

							//points.push({"lng":obj.data[i].lng,"lat":obj.data[i].lat,"count":obj.data[i].count})

						 }
						//alert(points)
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
						 var gradient = {.0:'rgb(255, 0, 0)',
										 .2:'rgb(255, 102, 0)',
										 .4:'rgb(255, 225, 0)',
										 .6:'rgb(51, 153, 51)',
										 .8:'rgb(0, 153, 204)',
	 	 	 							 1:'rgb(0, 153, 204)'
						  	    		};

						heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
						map.addOverlay(heatmapOverlay);
						heatmapOverlay.setOptions({"gradient":gradient});
						heatmapOverlay.setDataSet({data:points1,max:120});
						heatmapOverlay.show();

					});


 } ); 
 
	//判断浏览区是否支持canvas
    function isSupportCanvas(){
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }