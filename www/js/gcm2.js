var map, gmap, gsat, ghyb, gter, osm, prem, anomp, anompp, pren, tempm, anomt, tempn, tempmin, anomtmin, tempminn, tempmax, anomtmax, tempmaxn, etp, anometp, anometpp, etpn, seai, prea, tempa, etpa, etpaa, preaa, tempaa, tempmina, tempmaxa, tempminaa, tempmaxaa, info, vmes, vagno, vmes_n, filter, filter_n, filter_a, filterParams, svalue, pureCoverage, control, trans, vlayer, popups = {};
function init() {
	resizeMe();
    OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
	//set up projections
	// World Geodetic System 1984 projection
	var WGS84 = new OpenLayers.Projection("EPSG:4326");   
	// WGS84 Google Mercator projection
	var WGS84_google_mercator = new OpenLayers.Projection("EPSG:900913");
    map = new OpenLayers.Map({
        div: "map",
        projection: "EPSG:900913",
		displayProjection: WGS84,
    });
	
	var mp= new OpenLayers.Control.MousePosition({
					prefix: '<a target="_blank" ' +
					'href="http://spatialreference.org/ref/epsg/4326/">' +
					'</a> <strong>Coordinates</strong> WGS84: ',
					separator: ' | ',
					numDigits: 2,
					emptyString: 'Cursor is not over the map'
					}
				);
	var nav=new OpenLayers.Control.Navigation({dragPanOptions: {enableKinetic: true}});
	map.addControl(mp);
	map.addControl(nav);
	map.addControl(new OpenLayers.Control.leg2({ 'div' : leyendacapa }));
	//map.addControl(new OpenLayers.Control.Attribution());
    //var switcherControl = new OpenLayers.Control.LayerSwitcher();
	//map.addControl(switcherControl);
	var scale = new OpenLayers.Control.Scale();
	map.addControl(scale);
	// Cogemos una referencia al �div� del panel
	var divInfo = OpenLayers.Util.getElement('divinfo');

	// DEPRECATED
	// Creamos el panel de botones pasandole la referencia del �div�
	//var panel = new OpenLayers.Control.Panel({ 'div' : divInfo });	
	// var botonInfo = new OpenLayers.Control.Button({
	// 				displayClass: 'binfo', 
	// 				type: OpenLayers.Control.TYPE_TOGGLE,
	// 				title: 'Click over a point to get info',
	// 				eventListeners: {
	// 					'activate': function(){info.activate()}, 
	// 					'deactivate': function(){info.deactivate()}}
	// 				});
	// var botonInfo2 = new OpenLayers.Control.Button({
	// 				displayClass: 'binfo2', 
	// 				type: OpenLayers.Control.TYPE_BUTTON,
	// 				title: 'Click to get layer data info',
	// 				trigger: function() {
	// 					var urlst= 'http://www.globalclimatemonitor.org/ind.html'
	// 					window.open(urlst);
	// 				}
	// });
	// A�adimos los botones al panel
	//panel.addControls([botonInfo]);
// A�adimos el panel al mapa
	//map.addControl(panel);
    // If tile matrix identifiers differ from zoom levels (0, 1, 2, ...)
    // then they must be explicitly provided.
    var matrixIds = new Array(10);
    for (var i=0; i<10; ++i) {
        matrixIds[i] = "EPSG:900913:" + i;
    }
    // Create Google Mercator layers

    gmap = new OpenLayers.Layer.Google("Google Streets",
                  {
                      type: google.maps.MapTypeId.ROADMAP,
                      sphericalMercator: true,
					  numZoomLevels: 10,
					  visibility: false,
                  });
    gsat = new OpenLayers.Layer.Google("Google Satellite",
                  {
                      type: google.maps.MapTypeId.SATELLITE,
                      sphericalMercator: true,
					  numZoomLevels: 10,
					  visibility: false,
					
                  });
    ghyb = new OpenLayers.Layer.Google("Google Hybrid",
                  {
                      type: google.maps.MapTypeId.HYBRID,
                      sphericalMercator: true,
					  numZoomLevels: 10,
					  visibility: false,
                  });
    gter = new OpenLayers.Layer.Google("Google Terrain",
                  {
                      type: google.maps.MapTypeId.TERRAIN,
                      sphericalMercator: true,
					  numZoomLevels: 16,
					  visibility: false,
                  });
    osm = new OpenLayers.Layer.OSM(null, null, {isBaseLayer: true, numZoomLevels: 10, visibility: true});

	prem = new OpenLayers.Layer.WMS("Monthly precipitation", "/geoserver/gcm/wms?", {layers: 'pre_mensual_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=pre_mensual_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	anomp = new OpenLayers.Layer.WMS("Monthly precipitation anomalies", "/geoserver/gcm/wms?", {layers: 'anomalias_pre_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=anomalias_pre_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	anompp = new OpenLayers.Layer.WMS("Monthly precipitation anomalies p", "/geoserver/gcm/wms?", {layers: 'anomalias_pre_porcentaje_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=anomalias_pre_porcentaje_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	pren = new OpenLayers.Layer.WMS("Monthly precipitation normals", "/geoserver/gcm/wms?", {layers: 'pre_normales_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=pre_normales_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	tempm = new OpenLayers.Layer.WMS("Monthly temperature", "/geoserver/gcm/wms?", {layers: 'temp_mensual_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=temp_mensual_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	anomt = new OpenLayers.Layer.WMS("Monthly temperature anomalies", "/geoserver/gcm/wms?", {layers: 'anomalias_temp_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=anomalias_temp_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
//	anomtp = new OpenLayers.Layer.WMS("Monthly temperature anomalies p", "/geoserver/gcm/wms?", {layers: 'anomalias_temp_porcentaje_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=anomalias_temp_porcentaje_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	tempn = new OpenLayers.Layer.WMS("Monthly temperature normals", "/geoserver/gcm/wms?", {layers: 'temp_normales_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=temp_normales_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	seai = new OpenLayers.Layer.WMS("Seasonality Index", "/geoserver/gcm/wms?", {layers: 'seasonality_index_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=seasonality_index_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	indst = new OpenLayers.Layer.WMS("Number of stations of influence", "/geoserver/gcm/wms?", {layers: 'st1901_11', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=st1901_11&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	tempmin = new OpenLayers.Layer.WMS("Monthly minimum temperature", "/geoserver/gcm/wms?", {layers: 'temp_min_mensual_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=temp_min_mensual_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	anomtmin = new OpenLayers.Layer.WMS("Monthly minimum temperature anomalies", "/geoserver/gcm/wms?", {layers: 'anomalias_temp_min_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=anomalias_temp_min_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	tempminn = new OpenLayers.Layer.WMS("Monthly minimum temperature normals", "/geoserver/gcm/wms?", {layers: 'temp_min_normales_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=temp_min_normales_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	tempmax = new OpenLayers.Layer.WMS("Monthly maximum temperature", "/geoserver/gcm/wms?", {layers: 'temp_max_mensual_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=temp_max_mensual_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	anomtmax = new OpenLayers.Layer.WMS("Monthly maximum temperature anomalies", "/geoserver/gcm/wms?", {layers: 'anomalias_temp_max_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=anomalias_temp_max_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	tempmaxn = new OpenLayers.Layer.WMS("Monthly maximum temperature normals", "/geoserver/gcm/wms?", {layers: 'temp_max_normales_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=temp_max_normales_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	etp = new OpenLayers.Layer.WMS("Monthly etp", "/geoserver/gcm/wms?", {layers: 'etp_mensual_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=etp_mensual_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	anometp = new OpenLayers.Layer.WMS("Monthly etp anomalies", "/geoserver/gcm/wms?", {layers: 'anomalias_etp_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=anomalias_etp_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	anometpp = new OpenLayers.Layer.WMS("Monthly etp anomalies p", "/geoserver/gcm/wms?", {layers: 'anomalias_etp_porcentaje_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=anomalias_etp_porcentaje_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	etpn = new OpenLayers.Layer.WMS("Monthly etp normals", "/geoserver/gcm/wms?", {layers: 'etp_normales_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=etp_normales_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	prea = new OpenLayers.Layer.WMS("Annual precipitation", "/geoserver/gcm/wms?", {layers: 'pre_anual_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=pre_anual_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	tempa = new OpenLayers.Layer.WMS("Annual mean temperature", "/geoserver/gcm/wms?", {layers: 'temp_anual_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=temp_anual_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	tempmina = new OpenLayers.Layer.WMS("Annual minimum temperature", "/geoserver/gcm/wms?", {layers: 'temp_min_anual_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=temp_min_anual_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	tempmaxa = new OpenLayers.Layer.WMS("Annual maximum temperature", "/geoserver/gcm/wms?", {layers: 'temp_max_anual_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=temp_max_anual_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	etpa = new OpenLayers.Layer.WMS("Annual etp", "/geoserver/gcm/wms?", {layers: 'etp_anual_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=etp_anual_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	preaa = new OpenLayers.Layer.WMS("Annual precipitation anomalies", "/geoserver/gcm/wms?", {layers: 'anomalias_pre_anual_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=anomalias_pre_anual_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	tempaa = new OpenLayers.Layer.WMS("Annual mean temperature anomalies", "/geoserver/gcm/wms?", {layers: 'anomalias_temp_anual_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=anomalias_temp_anual_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	etpaa = new OpenLayers.Layer.WMS("Annual etp anomalies", "/geoserver/gcm/wms?", {layers: 'anomalias_etp_anual_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=anomalias_etp_anual_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	tempminaa = new OpenLayers.Layer.WMS("Annual minimum temperature anomalies", "/geoserver/gcm/wms?", {layers: 'anomalias_temp_min_anual_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=anomalias_temp_min_anual_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});
	tempmaxaa = new OpenLayers.Layer.WMS("Annual maximum temperature anomalies", "/geoserver/gcm/wms?", {layers: 'anomalias_temp_max_anual_espacial', transparent: true, format: "image/png"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1,leg2:"<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer=anomalias_temp_max_anual_espacial&format=image/png&width=12&height=18&legend_options=fontName:Arial;fontAntiAliasing:true;border:false;mx:0.5;my:0.02;dx:0.5;dy:0.07;fontSize:10;dpi:100'/>"});

	
	/*	indst = new OpenLayers.Layer.WMTS({
        name: "Number of stations of influence",
        url: "/geoserver/gwc/service/wmts",
        layer: "litoral:st1901_11",
        matrixSet: "EPSG:900913",
        matrixIds: matrixIds,
        format: "image/png",
        style: "N_stations",
        opacity: 1,
        isBaseLayer: false,
		displayInLayerSwitcher: false,
		visibility: false,
		leg2:"<img src='legends/st1901_11.png'/>"
    });*/



//Filtro cql antes de info

	
	
//info

        info = new OpenLayers.Control.WMSGetFeatureInfo({
            url: '/geoserver/gcm/wms?', 
            title: 'Identify features by clicking',
            queryVisible: true,
			maxFeatures: 1,
			layers: [prem,anomp,anompp,pren,tempm,anomt,tempn,tempmin,anomtmin,tempminn,tempmax,anomtmax,tempmaxn,etp,anometp,anometpp,etpn,seai,prea,tempa,etpa,tempmina,tempmaxa,preaa,tempaa,etpaa,tempmaxaa,tempminaa],
            eventListeners: {
                beforegetfeatureinfo: function(event) {
					var prenvis = pren.getVisibility();
					var tempnvis = tempn.getVisibility();
					var tempminn_vis = tempminn.getVisibility();
					var tempmaxn_vis = tempmaxn.getVisibility();
					var etpn_vis = etpn.getVisibility();
					var seaivis = seai.getVisibility();
					var preavis = prea.getVisibility();
					var tempavis = tempa.getVisibility();
					var tempminavis = tempmina.getVisibility();
					var tempmaxavis = tempmaxa.getVisibility();
					var etpavis = etpa.getVisibility();
					var etpaavis = etpaa.getVisibility();
					var preaavis = preaa.getVisibility();
					var tempaavis = tempaa.getVisibility();
					var tempminaavis = tempminaa.getVisibility();
					var tempmaxaavis = tempmaxaa.getVisibility();
					var vmes_n = mes_n.value;
					var vperiod_n = period_n.value;
					var	vmes = mes.value;
					var vagno = agno.value;
					var filter;
					if (prenvis === true){
						filter = "mes = "+ vmes_n + "AND period = " + vperiod_n + "AND n_period = 30"
					}
					else if (tempnvis === true) {
						filter = "mes = "+ vmes_n + "AND period = " + vperiod_n + "AND n_period = 30"
					}
					else if (tempminn_vis === true) {
						filter = "mes = "+ vmes_n + "AND period = " + vperiod_n + "AND n_period = 30"
					}
					else if (tempmaxn_vis === true) {
						filter = "mes = "+ vmes_n + "AND period = " + vperiod_n + "AND n_period = 30"
					}
					else if (etpn_vis === true) {
						filter = "mes = "+ vmes_n + "AND period = " + vperiod_n + "AND n_period = 30"
					}
					else if (seaivis === true) {
						filter = " agno = "+ vagno;
					}
					else if (preavis === true) {
						filter = " agno = "+ vagno;
					}
					else if (tempavis === true) {
						filter = " agno = "+ vagno;
					}
					else if (tempminavis === true) {
						filter = " agno = "+ vagno;
					}
					else if (tempmaxavis === true) {
						filter = " agno = "+ vagno;
					}
					else if (etpavis === true) {
						filter = " agno = "+ vagno;
					}
					else if (etpaavis === true) {
						filter = " agno = "+ vagno;
					}
					else if (preaavis === true) {
						filter = " agno = "+ vagno;
					}
					else if (tempaavis === true) {
						filter = " agno = "+ vagno;
					}
					else if (tempminaavis === true) {
						filter = " agno = "+ vagno;
					}
					else if (tempmaxaavis === true) {
						filter = " agno = "+ vagno;
					}
					else {
						filter = "mes = "+ vmes + "AND" + " agno = "+ vagno;
					}
					this.vendorParams = { cql_filter: filter }; 
                }, 
				getfeatureinfo: function(event) {

					$.fancybox(event.text,{
						"closeBtn" : false
					});
					
                    // map.addPopup(new OpenLayers.Popup.FramedCloud(
                    //     "chicken", 
                    //     map.getLonLatFromPixel(event.xy),
                    //     new OpenLayers.Size(400,300), //size
                    //     event.text,//content HTML
                    //     null, //anchor
                    //     true //closeBox
                    // ));
                }
            }
        });
        map.addControl(info);
   

//fin info

    map.addLayers([osm, gsat, gmap, ghyb, gter, prem, anomp, anompp, pren, tempm, tempmin, anomt, anomtmin, tempn, tempminn, tempmax, anomtmax, tempmaxn, etp, anometp, anometpp, etpn, seai, prea, tempa, tempmina, tempmaxa, indst, etpa, preaa, tempaa, etpaa, tempmaxaa, tempminaa]);
	map.setCenter(
						new OpenLayers.LonLat(10, 35).transform(
							new OpenLayers.Projection("EPSG:4326"),
							map.getProjectionObject()
						),3);

    // create WMTS GetFeatureInfo control
    
}  

			function UpdateFilterfirst() {
                if(pureCoverage)
                  return;
				var capa = indicador.value
				var vlayer = map.getLayersByName(capa)[0];
				var vmes = mes.value;
				var vagno = agno.value;
				var filter = "mes = "+ vmes + "AND" + " agno = "+ vagno;
                // by default, reset all filters
                var filterParams = {
                    cql_filter: null,
                };
                if (OpenLayers.String.trim(filter) != "") {
                        filterParams["cql_filter"] = filter;
                }
                // merge the new filter definitions
                vlayer.mergeNewParams(filterParams);
				vlayer.setVisibility(true);
         	}
			function UpdateFilter() {
window.stop();
                if(pureCoverage)
                  return;
				var oldind;
					if (indicador.oldvalue === undefined) {
					oldind = indicador.value;
					}
					else {
					oldind = indicador.oldvalue;
					}
				var old_n;
					if (normals.oldvalue === undefined) {
					old_n = normals.value;
					}
					else {
					old_n = normals.oldvalue;
					}
				var old_a;
					if (annuals.oldvalue === undefined) {
					old_a = annuals.value;
					}
					else {
					old_a = annuals.oldvalue;
					}
				var capa = indicador.value
				var capa_n = normals.value
				var capa_a = annuals.value;
				var vlayer = map.getLayersByName(capa)[0];
				var vlayerold = map.getLayersByName(oldind)[0];
				var vlayer_n = map.getLayersByName(capa_n)[0];
				var vlayer_a = map.getLayersByName(capa_a)[0];
				var vlayerold_a = map.getLayersByName(old_a)[0];
				var vlayerold_n = map.getLayersByName(old_n)[0];
				var capa_st = station.value
				var vlayer_st = map.getLayersByName(capa_st)[0];
				var vmes = mes.value;
				var vagno = agno.value;
				var filter = "mes = "+ vmes + "AND" + " agno = "+ vagno;
                // by default, reset all filters
                var filterParams = {
                    cql_filter: null,
                };
                if (OpenLayers.String.trim(filter) != "") {
                        filterParams["cql_filter"] = filter;
                }
                // merge the new filter definitions
                vlayer.mergeNewParams(filterParams);
				vlayerold.setVisibility(false);
				vlayerold_a.setVisibility(false);
				vlayer_a.setVisibility(false);
				vlayerold_n.setVisibility(false);
				vlayer_n.setVisibility(false);
				vlayer_st.setVisibility(false);				
				vlayer.setVisibility(true);
				indst.setVisibility(false);
         	}
			function UpdateFilter_a() {
window.stop();
                if(pureCoverage)
                  return;
				var oldind;
					if (indicador.oldvalue === undefined) {
					oldind = indicador.value;
					}
					else {
					oldind = indicador.oldvalue;
					}
				var old_n;
					if (normals.oldvalue === undefined) {
					old_n = normals.value;
					}
					else {
					old_n = normals.oldvalue;
					}
				var old_a;
					if (annuals.oldvalue === undefined) {
					old_a = annuals.value;
					}
					else {
					old_a = annuals.oldvalue;
					}
				var capa = indicador.value
				var capa_n = normals.value
				var capa_a = annuals.value;
				var vlayer = map.getLayersByName(capa)[0];
				var vlayerold = map.getLayersByName(oldind)[0];
				var vlayer_n = map.getLayersByName(capa_n)[0];
				var vlayer_a = map.getLayersByName(capa_a)[0];
				var vlayerold_a = map.getLayersByName(old_a)[0];
				var vlayerold_n = map.getLayersByName(old_n)[0];
				var capa_st = station.value
				var vlayer_st = map.getLayersByName(capa_st)[0];
				var vagno = agno_a.value;
				var filter = "agno = "+ vagno;
                // by default, reset all filters
                var filterParams = {
                    cql_filter: null,
                };
                if (OpenLayers.String.trim(filter) != "") {
                        filterParams["cql_filter"] = filter;
                }
                // merge the new filter definitions
                vlayer_a.mergeNewParams(filterParams);
				vlayerold.setVisibility(false);
				vlayerold_a.setVisibility(false);
				vlayer.setVisibility(false);
				vlayerold_n.setVisibility(false);
				vlayer_n.setVisibility(false);
				vlayer_st.setVisibility(false);			
				vlayer_a.setVisibility(true);
				indst.setVisibility(false);
         	}
			function UpdateFilter_n() {
window.stop();
                if(pureCoverage)
                  return;
				var old_n;
					if (normals.oldvalue === undefined) {
					old_n = normals.value;
					}
					else {
					old_n = normals.oldvalue;
					}
				var oldind;
					if (indicador.oldvalue === undefined) {
					oldind = indicador.value;
					}
					else {
					oldind = indicador.oldvalue;
					}
				var old_a;
					if (annuals.oldvalue === undefined) {
					old_a = annuals.value; 
					}
					else {
					old_a = annuals.oldvalue;
					}
				var capa_n = normals.value;
				var capa = indicador.value;
				var capa_a = annuals.value;
				var vmes_n = mes_n.value;
				var vperiod_n = period_n.value;
				var vlayer_n = map.getLayersByName(capa_n)[0];
				var vlayerold_n = map.getLayersByName(old_n)[0];
				var vlayer = map.getLayersByName(capa)[0];
				var vlayer_a = map.getLayersByName(capa_a)[0];
				var vlayerold_a = map.getLayersByName(old_a)[0];
				var vlayerold = map.getLayersByName(oldind)[0];
				var capa_st = station.value
				var vlayer_st = map.getLayersByName(capa_st)[0];
				var filter_n = "mes = " + vmes_n + "AND period = " + vperiod_n + "AND n_period = 30";
                // by default, reset all filters
                var filterParams = {
                    cql_filter: null,
                };
                if (OpenLayers.String.trim(filter_n) != "") {
                        filterParams["cql_filter"] = filter_n;
                }
                // merge the new filter definitions
				vlayer_n.mergeNewParams(filterParams);
				vlayerold_n.setVisibility(false);
				vlayerold.setVisibility(false);
				vlayer.setVisibility(false);
				vlayerold_a.setVisibility(false);
				vlayer_a.setVisibility(false);
				vlayer_st.setVisibility(false);					
				vlayer_n.setVisibility(true);
				indst.setVisibility(false);
         	}
			
			
			function stationsVis(){
					if(pureCoverage)
						  return;
					var capa_st;
						if (station.oldvalue === undefined) {
						capa_st = station.value;
						}
						else {
						capa_st = station.oldvalue;
						}
                   var capa = indicador.value;
				   var vlayer = map.getLayersByName(capa)[0];
				   var capa_a = annuals.value;
				   var vlayer_a = map.getLayersByName(capa_a)[0];	
				   var capa_n = normals.value;
				   var vlayer_n = map.getLayersByName(capa_n)[0];
				   var vlayer_st = map.getLayersByName(capa_st)[0];
				   vlayer.setVisibility(false);
				   vlayer_n.setVisibility(false);
				   vlayer_a.setVisibility(false);
				   vlayer_st.setVisibility(true);
                }

		
		function updateTransparency(value) {
			var tvalue = (1-(value/100))*100;
			var capa_n = normals.value;
			var vlayer_n = map.getLayersByName(capa_n)[0];
			var capa_a = annuals.value;
			var vlayer_a = map.getLayersByName(capa_a)[0];			
			var capa = indicador.value;
			var vlayer = map.getLayersByName(capa)[0];
			var capa_st = station.value;
			var vlayer_st = map.getLayersByName(capa_st)[0];
			vlayer.setOpacity(tvalue / 100);
			vlayer_n.setOpacity(tvalue / 100);
			vlayer_st.setOpacity(tvalue / 100);
			vlayer_a.setOpacity(tvalue / 100);
		}


		




