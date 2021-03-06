//Control para el dibujado del bounding box
var vectors = new OpenLayers.Layer.Vector("Vector Layer", {
		  displayInLayerSwitcher: false
		});


var box = new OpenLayers.Control.DrawFeature(vectors, OpenLayers.Handler.RegularPolygon, {
  handlerOptions: {
    sides: 4,
    snapAngle: 90,
    irregular: true,
    persist: true
  }
});

var downloadBound;
var downloadBoundPicture;


$(document).ready(function() {

	// var variables = $("#indicador option");
	// for(var i=0; i<variables.length; i++){
	// 	if(!$(variables[i]).is(':disabled')){
	// 		$(".fancyDownload .variableList").append('<li val="' + $(variables[i]).val() + '">' + $(variables[i]).text() + '<lis>')
	// 	}
	// }

	generateDownloadSelect("#agno_a",".byAnnualYearSelect");
	generateDownloadSelect("#agno",".yearSelect");
	generateDownloadSelect("#mes",".monthSelect");
	generateDownloadSelect("#period_n",".perdiodSelect");
	generateDownloadSelect("#mes_n",".perdiodMonthSelect");
	generateDownloadSelect("#period_t",".trendSelect");
	generateDownloadSelect("#indicador",".variableDownload");
	

	$(".fancyDownload input[name='timeType']").change(function(e) {
		$(".fancyDownload .downloadMonth div").removeClass('active');
		$(".fancyDownload .downloadMonth div[value=" + $(this).val() + "]").addClass('active');

		$(".fancyDownload .variableDownload option").remove()
		var prefix = '';
		if($(this).val() == 'v_trends'){
			prefix = 'trends_'
		}
		generateDownloadSelect("#" + $(this).val(),".variableDownload", prefix);
	});

	$(".fancyDownload input[name='type']").change(function(e) {
		$(".fancyDownload input[name='type']").next('.labelType').removeClass('active');
		$(this).next('.labelType').addClass('active');

		$(".fancyDownload div[type='data']").removeClass('active');
		$(".fancyDownload div[type='picture']").removeClass('active');
		$(".fancyDownload div[type=" + $(this).val() + "]").addClass('active');

		if($(this).val() == 'data' && !$(".fancyDownload input[value='shape']").is(':checked') && !$(".fancyDownload input[value='kml_p']").is(':checked')){
			$('#monthSelectTo, #yearSelectTo, #byAnnualYearSelectTo, .fancyDownload .downloadMonth i').removeClass('hide');
		}else{
			$('#monthSelectTo, #yearSelectTo, #byAnnualYearSelectTo, .fancyDownload .downloadMonth i').addClass('hide');
		}
	});

	$(".fancyDownload input[name='fileTypeData']").change(function(e) {
		if($(".fancyDownload input[value='shape']").is(':checked') || $(".fancyDownload input[value='kml_p']").is(':checked')){
			$('#monthSelectTo, #yearSelectTo, #byAnnualYearSelectTo, .fancyDownload .downloadMonth i').addClass('hide');
		}else{
			$('#monthSelectTo, #yearSelectTo, #byAnnualYearSelectTo, .fancyDownload .downloadMonth i').removeClass('hide');
		}
	});

	$(".fancyDownload input[name='Close']").click(function(e) {
	parent.$.fancybox.close();
	})

	$(".fancyDownload input[name='Download']").click(function(e) {
		var layer = map.getLayersByName($(".fancyDownload .variableDownload").val())[0];
		var filter = '';
		var timeType = $(".fancyDownload input[name='timeType']:checked").val();
		var type = $(".fancyDownload input[name='type']:checked").val();
		var range = false;
		if(type == 'data' && !$(".fancyDownload input[value='shape']").is(':checked') && !$(".fancyDownload input[value='kml_p']").is(':checked')){
			range = true;
		}
		
		if(timeType == 'indicador'){
			var yearFrom = $(".fancyDownload #yearSelectFrom").val();
			var monthFrom = $(".fancyDownload #monthSelectFrom").val();
			var yearTo = $(".fancyDownload #yearSelectTo").val();
			var monthTo = $(".fancyDownload #monthSelectTo").val();
			filter = '';	
			// if(type=='data'){
			if(range){
				if(yearFrom == yearTo){
					filter = 'mes >= ' + monthFrom + ' AND mes <= ' + monthTo + ' AND agno =' + yearTo
				}else{
					for(var i=yearFrom; i<= yearTo; i++){
						if(i==yearFrom){
							filter += 'mes >= ' + monthFrom + ' AND agno =' + yearFrom
						}else if(i==yearTo){
							filter += ' OR mes <= ' + monthTo + ' AND agno =' + yearTo
						}else{
							filter += ' OR mes >= 1 AND agno =' + i
						}
					}
				}

			}else{
				filter = 'mes = ' + monthFrom + ' AND agno = ' + yearFrom;	
			}

		}else if(timeType == 'annuals'){
			var yearFrom = $(".fancyDownload #byAnnualYearSelectFrom").val();
			var yearTo = $(".fancyDownload #byAnnualYearSelectTo").val();
			filter = '';
			// if(type=='data'){
			if(range){
				for(var i=yearFrom; i<= yearTo; i++){
					filter += 'agno = ' + i;
					if(i != yearTo){
						filter += ' OR ';
					}
				}
			}else{
				filter = 'agno = ' + yearFrom;
			}

		}else if(timeType == 'normals'){
			var year = $(".fancyDownload .perdiodSelect").val();
			var month = $(".fancyDownload .perdiodMonthSelect").val();
			filter = 'mes = ' + month + ' AND period = ' + year + ' AND n_period = 30'

		}else if(timeType == 'v_trends'){
			var year = $(".fancyDownload .trendSelect").val();
			var capa = $(".fancyDownload .variableDownload").val();
			n_trend = capa.substr(capa.length - 1);
			filter = 'cod_variable =' + n_trend + ' AND period = ' + year;
		}

		// var extent = map.getExtent();
		// var bbox = extent.toBBOX().split(",");
		
		// if(type=='data'){
/*		if(range){
			var bbox = downloadBound.toBBOX().split(",");
		}else{
			var bbox = downloadBoundPicture.toBBOX().split(",");
		}
*/
		var bbox = downloadBoundPicture.toBBOX().split(",");

		var x1 = bbox [0];
		var x2 = bbox [2];
		var y1 = bbox [1];
		var y2 = bbox [3];


		// if(type=='data'){
		if(range){
			var layerName = layer.params["LAYERS"] + "_old";
			var fileType =$(".fancyDownload input[name='fileTypeData']:checked").val();
			var filter = 'BBOX%28geom' + ',' + x1 + ',' + y1 + ',' + x2 + ',' + y2 + '%29AND%28' + filter + '%29';	
			var urlroot = 'http://www.globalclimatemonitor.org/geoserver/gcm/wfs?service=wfs&version=1.0.0&request=GetFeature&typeNames=gcm:';
			var url = urlroot + layerName + '&CQL_FILTER=' + filter +'&outputFormat=' + fileType;
		}else{

			var layerName = layer.params["LAYERS"];
			if(type=="data"){
				var fileType =$(".fancyDownload input[name='fileTypeData']:checked").val();
			}else{
				var fileType =$(".fancyDownload input[name='fileTypePicture']:checked").val();
			}
			
			if(fileType == 'tiff' || fileType == 'jpg' || fileType == 'shape'){
				if(fileType == 'shape'){
					var o_style= layer.params ["STYLES"];
					var longcadena=o_style.length;
					var last7= o_style.substring(longcadena, longcadena - 7);
					if (last7 =="_circle") {
						layerName = layer.params["LAYERS"] + "_old";
//						var extent2 = downloadBoundPicture.clone().transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));		
//						extent2 = map.getExtent();
//						bbox = extent2.toBBOX().split(",");
						x1 = bbox [0];
						x2 = bbox [2];
						y1 = bbox [1];
						y2 = bbox [3];
						// bbox = extent.toBBOX();						
					}
					else {
						layerName = layer.params["LAYERS"];
//						var extent2 = downloadBoundPicture.clone().transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));
//						extent2 = map.getExtent();
//						bbox = extent2.toBBOX().split(",");
						x1 = bbox [0];
						x2 = bbox [2];
						y1 = bbox [1];
						y2 = bbox [3];
					}
				}else{
					if (x1 < -20037508.34) {x1 = -20037508.34};
					if (x2 > 20037508.34) {x2 = 20037508.34};
					if (y1 < -15538711.1) {y1 = -15538711.1};
					if (y2 > 15538711.1) {y2 = 15538711.1};	
					var bbox =	x1 + "," + y1 + "," + x2 + "," + y2;
				}
			}
			
			var x = x2-x1;
			var y = y2-y1;
			z = x/y;
			if(fileType == 'shape' || fileType == 'kml_p'){
				height = 1024/z;
			}else{
				height = 2048/z;
			}
			height = Math.round( height );

			if(fileType == 'kml'){
				restoparams = '&format_options=legend:true;SUPEROVERLAY:false;AUTOFIT:true;KMPLACEMARK:false;KMSCORE:0;KMATTR:true;MODE:refresh&WIDTH=2048&HEIGHT=' + height;
				var urlroot = 'http://www.globalclimatemonitor.org/geoserver/gcm/wms?FORMAT=application/vnd.google-earth.kml+xml&REQUEST=GetMap&SRS=epsg:900913&STYLES=' + layerName;
				var url = urlroot + '&LAYERS='+ layerName + '&CQL_FILTER=' + filter + '&BBOX=' + bbox + restoparams;

			}else if(fileType == 'kml_p'){
				var style = layerName;
				restoparams = '&format_options=legend:true;SUPEROVERLAY:false;AUTOFIT:true;KMPLACEMARK:false;KMSCORE:100;KMATTR:true;MODE:refresh&WIDTH=1024&HEIGHT=' + height;
				var urlroot = 'http://www.globalclimatemonitor.org/geoserver/gcm/wms?FORMAT=application/vnd.google-earth.kml+xml&REQUEST=GetMap&SRS=epsg:900913&STYLES=' + style;
				var url = urlroot + '&LAYERS='+ layerName + '&CQL_FILTER=' + filter + '&BBOX=' + bbox + restoparams;

			}else if(fileType == 'tiff'){
				restoparams = '&STYLES=' + layer.params["STYLES"] + '&WIDTH=2048&HEIGHT=' + height + '&format_options=dpi:600';
				var urlroot = 'http://www.globalclimatemonitor.org/geoserver/gcm/wms/?FORMAT=image/geotiff8&REQUEST=GetMap&SRS=epsg:900913&';
				var url = urlroot + 'LAYERS='+ layerName + '&CQL_FILTER=' + filter + '&BBOX=' + bbox + restoparams;

			}else if(fileType == 'jpg'){
			  //restoparams = '&STYLES=' + layer.params["STYLES"] + '&WIDTH=2048&HEIGHT=' + height + '&format_options=dpi:150;layout:deco_' + layerName;
				restoparams = '&STYLES=' + layer.params["STYLES"] + '&WIDTH=2048&HEIGHT=' + height + '&format_options=dpi:150';
				var urlroot = 'http://www.globalclimatemonitor.org/geoserver/gcm/wms/?FORMAT=image/jpeg&REQUEST=GetMap&SRS=epsg:900913&';
				var url = urlroot + '&LAYERS='+ layerName + '&CQL_FILTER=' + filter + '&BBOX=' + bbox + restoparams;

			}else if(fileType == 'shape'){
				var filter = 'BBOX%28geom' + ',' + x1 + ',' + y1 + ',' + x2 + ',' + y2 + '%29AND%28' + filter + '%29';					
				var urlroot = 'http://www.globalclimatemonitor.org/geoserver/gcm/wfs?service=wfs&version=1.0.0&SRS=EPSG:900913&request=GetFeature&typeNames=gcm:';
				var url = urlroot + layerName + '&CQL_FILTER=' + filter + '&WIDTH=1024&HEIGHT=' + height +'&outputFormat=SHAPE-ZIP' + '&format_options=filename:gcm_download.zip';
			}
		}

		// if(type=='data' && (timeType == 'indicador' || timeType == 'annuals')){
        var vagno = agno.value;
		var capa = $(".fancyDownload .variableDownload").val();
		if ((timeType == 'indicador' || timeType == 'annuals') && Number(vagno) >= 2013 && capa !== "Monthly precipitation" && capa !== "Monthly precipitation anomalies" && capa !== "Monthly precipitation anomalies p" && capa !== "Monthly temperature" && capa !== "Monthly temperature anomalies") {
			alert ("There is no data for selected layer/month/year.\n------------------------------\nPlease, modify your selection.\n------------------------------\nFrom January 2012, only layers of monthly rainfall,mean temperature and their anomalies are available.");
		}
		else if(range && (timeType == 'indicador' || timeType == 'annuals')){
			var columnNumbers = (downloadBound.right - downloadBound.left)/0.5;
			var rowNumbers = (downloadBound.top - downloadBound.bottom)/0.5;
			var points = columnNumbers * rowNumbers;
			if(points > 67421){
				points = 67421;
			}
			var oneDay = 24*60*60*1000
			if(timeType == 'annuals'){
				var diffDate =  yearTo - yearFrom + 1;
			}else{
				var firstDate = new Date(yearFrom,monthFrom-1,01);
				var secondDate = new Date(yearTo,monthTo-1,01);
				var diffDate = (secondDate.getFullYear() - firstDate.getFullYear()) * 12;
				diffDate += secondDate.getMonth() + 1;
				diffDate -= firstDate.getMonth();
			}
			if(diffDate * points > 500000){
				alert("The download is limited to a maximum of 500000 rows per request. Please, try redefining you download options");
			}else{
				window.open(url);	
			}
		}else{
			window.open(url);
		}
	});

	

	$("#pointDownload").click(function(e) {
		$("#map").addClass('pointDownload');
		
		$("#OpenLayers_Map_2_OpenLayers_ViewPort").unbind().click(function(){
			$("#map").removeClass('pointDownload');
			$("#OpenLayers_Map_2_OpenLayers_ViewPort").off("click");

			$.fancybox($(".fancyDownload"),{
				// afterShow: function () {
				// 	$(this.content).find("input[type='button']").click(function() {
						
				// 	});	    	
				// }
			});

		});
	});

	// $("#boxDownload").click(function(e) {
	// 		map.addLayer(vectors);
	// 		map.addControl(box);
	//         box.activate();
	//         box.handler.callbacks.done = function(bbox){
	//         	map.removeLayer(vectors);
	//         	map.removeControl(box);
	//         	box.deactivate()
	//         };
	// });

	$("#ctrl_download_options .liPoint").click(function(e){
		$(".fancyDownload input[name='type'][value='data']").trigger('click');
		$(".fancyDownload input[name='type'][value='picture']").hide();
		$(".fancyDownload input[name='type'][value='picture']").next('.labelType').hide();
		// map.events.register("click", map , function(e){
		// 	var lonlat = map.getLonLatFromViewPortPx(e.xy).transform(
		//        new OpenLayers.Projection("EPSG:900913"),
		//        new OpenLayers.Projection("EPSG:4326")
		//      );

		// 	var row = Math.floor(lonlat.lon / 0.5);
		// 	var column = Math.floor(lonlat.lat / 0.5);
		// 	row = row * 0.5;
		// 	column = column * 0.5;
		// 	lonlatTo = new OpenLayers.LonLat(row,column);
		// 	lonlatFrom = new OpenLayers.LonLat(row + 0.5, column + 0.5);
		// 	downloadBound = new OpenLayers.Bounds()
		// 	downloadBound.extend(lonlatTo);
		// 	downloadBound.extend(lonlatFrom);

		// 	// $.fancybox($(".fancyDownload"))
		// 	alert("");
		// 	map.events.unregister("click", map , function(e){
		// 	});
			
		// 	// var markers = new OpenLayers.Layer.Markers( "Markers" );
		//  //    map.addLayer(markers);
		//  //    markers.addMarker(new OpenLayers.Marker(lonlatTo));
		//  //    markers.addMarker(new OpenLayers.Marker(lonlatFrom));
		//     // lonlatTo = new OpenLayers.LonLat('-991235.382664','4227579.159808');
		//     // lonlatFrom = new OpenLayers.LonLat('-245209.986705','4483184.582358');
		//     // markers.addMarker(new OpenLayers.Marker(lonlatTo));
		//     // markers.addMarker(new OpenLayers.Marker(lonlatFrom));

		// });

		map.events.register("click", map,clickDownloadPoint);
	});

	$("#ctrl_download_options .liBounding").click(function(e){
		$(".fancyDownload input[name='type'][value='picture']").show();
		$(".fancyDownload input[name='type'][value='picture']").next('.labelType').show();
		map.addLayer(vectors);
		map.addControl(box);
        box.activate();
        box.handler.callbacks.done = function(bbox){
        	map.removeLayer(vectors);
        	map.removeControl(box);
        	box.deactivate()
        	downloadBoundPicture = bbox.getBounds();
        	downloadBound = bbox.getBounds().clone().transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
        	showFancyDownload('bounding');
        };
	});

	$("#ctrl_download_options .liMap").click(function(e){
		$(".fancyDownload input[name='type'][value='picture']").show();
		$(".fancyDownload input[name='type'][value='picture']").next('.labelType').show();
		var lonlatTo = new OpenLayers.LonLat("-23872812.670703","-11310234.199726");
		var lonlatFrom = new OpenLayers.LonLat("23872812.670703","20037508.34");
		downloadBoundPicture = new OpenLayers.Bounds()
		downloadBoundPicture.extend(lonlatTo);
		downloadBoundPicture.extend(lonlatFrom);
		downloadBound = downloadBoundPicture.clone().transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
		showFancyDownload('map');
	});

	$("#ctrl_download").click(function(e) {
		$(this).toggleClass('active');
		$("#ctrl_download_options").toggleClass('active');
		if(!$(this).hasClass('active')){
			$("#ctrl_download_options li").removeClass('active');
			map.events.unregister("click", map,clickDownloadPoint);
			if(map.getLayersByName("Vector Layer").length > 0){
				map.removeLayer(vectors);
				map.removeControl(box);
			}
        	
        	box.deactivate()
		}else{
			if($("#ctrl_info_ctrl").hasClass('enable')){
				$("#ctrl_info_ctrl").trigger('click');
			}
			if($("#ctrl_zbox_ctrl").hasClass('enable')){
				$("#ctrl_zbox_ctrl").trigger('click');
			}
		}
	});

	$("#ctrl_download_options li").click(function(e) {
		$("#ctrl_download_options li").removeClass('active');
		$(this).addClass('active');
	});

});

function clickDownloadPoint(e){
	var lonlat = map.getLonLatFromViewPortPx(e.xy).transform(
       new OpenLayers.Projection("EPSG:900913"),
       new OpenLayers.Projection("EPSG:4326")
     );

	var row = Math.floor(lonlat.lon / 0.5);
	var column = Math.floor(lonlat.lat / 0.5);
	row = row * 0.5;
	column = column * 0.5;
	lonlatTo = new OpenLayers.LonLat(row,column);
	lonlatFrom = new OpenLayers.LonLat(row + 0.5, column + 0.5);
	downloadBound = new OpenLayers.Bounds()
	downloadBound.extend(lonlatTo);
	downloadBound.extend(lonlatFrom);

	showFancyDownload('point');
	map.events.unregister("click", map,clickDownloadPoint);
}

function showFancyDownload(type){
	$.fancybox($(".fancyDownload"),{
				beforeShow: function () {
					if(type == 'point'){
						$(".fancyDownload input[value='shape']").addClass('hide');
						$(".fancyDownload input[value='shape']").next('label').addClass('hide');
						$(".fancyDownload input[value='kml_p']").addClass('hide');
						$(".fancyDownload input[value='kml_p']").next('label').addClass('hide');
						$(".fancyDownload input[value='csv']").trigger('click');
					}else{
						$(".fancyDownload input[value='shape']").removeClass('hide');
						$(".fancyDownload input[value='shape']").next('label').removeClass('hide');
						$(".fancyDownload input[value='kml_p']").removeClass('hide');
						$(".fancyDownload input[value='kml_p']").next('label').removeClass('hide');
					}
				},
				afterClose: function () {
					$("#ctrl_download_options li").removeClass('active');
					$("#ctrl_download").removeClass('active');
					$("#ctrl_download_options").removeClass('active');
				}
			});
}

function generateDownloadSelect(key, select, prefix){
	prefix = typeof prefix !== 'undefined' ? prefix : '';
	var aux = $(key + " option");
	for(var i=0; i<aux.length; i++){
		if(!$(aux[i]).is(':disabled')){
			$(".fancyDownload " + select).append('<option value="' + prefix + $(aux[i]).val() + '">' + $(aux[i]).text() + '</option>')	
		}
	}
}