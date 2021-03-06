// Instance the tour
var tour = new Tour({
  steps: [
  {
    element: "",
    title: "Guided Tour",
    content: "Welcome to Global climate Monitor guided tour!<br /><br />Take a minute to know better how to use the viewer.<br /><br />You can try any feature and tool as you are taking the tour. You can also exit the tour at any time by clicking on the 'End' button",
	orphan: true,
	animation: true,
	backdrop: true,
  },
      {
    element: "#sidebar",
    title: "The layer selector",
    content: "Here you can choose the variable/indicator and time scale that you want to be displayed.",
	animation: true,
  },
      {
    element: "#sh_sidebar",
    title: "The layer selector",
    content: "The layer selector is collapsible, so you can maximize the map display.",
	animation: true,
	onShow: function () {
			var $resume = $('#sidebar .resume');
			var $selectedLi = $('#sidebar nav li.expanded');

			if ($selectedLi.length > 0) {
				$resume.html('<span class="category">' + $selectedLi.children('h2').eq(0).html() + '</span>');
				var $selects = $selectedLi.find('select');
				$resume.append('<span class="criteria">' + $selects.eq(0).val() + '</span>');
				$resume.append(' ' + $selects.eq(1).val() + ' ' + $selects.eq(2).val());
			}

			$('#sidebar').toggleClass('contracted');
			resizeMe();
		},	
	onHide: function () {
			$sidebar = $('#sidebar');
			$sidebar.removeClass('contracted');
			resizeMe();
		}	
  },
      {
    element: "#dialog1a",
    title: "Monthly maps",
    content: "Here you will find the maps of the monthly values. As soon as you select a variable or change the month or year, the map will be updated.",
	animation: true
  },
      {
    element: "#dialog2a",
    title: "Annual maps",
    content: "Here you will find the maps of the annual values.",
	animation: true,
	onShow: function () {
		$('nav ul li.expanded').removeClass('expanded').children('.controls').eq(0).slideUp();
		$('#diag2').addClass('expanded');
		}
  },
      {
    element: "#dialog3a",
    title: "Normals maps",
    content: "Displays the monthly or seasonal climatologies of the climatic variables. You can choose among several 30-years periods from 1901 until 2000 ",
	animation: true,
	onShow: function () {
		$('nav ul li.expanded').removeClass('expanded').children('.controls').eq(0).slideUp();
		$('#diag3').addClass('expanded');
		}
  },
      {
    element: "#dialog4a",
    title: "Trends maps",
    content: "Displays the annual linear trends of the climatic variables over three different periods",
	animation: true,
	onShow: function () {
		$('nav ul li.expanded').removeClass('expanded').children('.controls').eq(0).slideUp();
		$('#diag4').addClass('expanded');
		},
	onHide: function () {
		$('nav ul li.expanded').removeClass('expanded').children('.controls').eq(0).slideUp();
		$('#diag1').addClass('expanded');
		}
  },
      {
    element: "#legend",
    title: "The legend",
    content: "The collapsible legend is updated automatically. You can set the transparency of the visible layer using the slider at the bottom.",
	animation: true,
	onShow: function () {
		$("#legend_h3").addClass("contracted");
		$("#legend_h3").parent().find('.content').slideToggle();
		},
	onShown: function () {
		$("#legend_h3").removeClass("contracted");
		$("#legend_h3").parent().find('.content').slideToggle();
		}	
  },
      {
    element: "#layer_switcher",
    title: "Base layer and coordinates",
    content: "Use this switch control to change base layer. Coordinates are shown on the left as you move over the map.",
	animation: true,
	placement: 'bottom'
  },
      {
    element: "#ctrl_zbox_ctrl",
    title: "Navigation tools",
    content: "the first six buttons are navigation tools: Zoom level in and zoom level out. Navigation history, zoom to box and zoom to full extent.",
	animation: true,
	placement: 'left'
  },
      {
    element: "#ctrl_info_ctrl",
    title: "Information tools",
    content: "The two next buttons are information tools: The first lets you get a point's value. The second provides information about the variable that is being displayed",
	animation: true,
	placement: 'left'
  },
      {
    element: "#ctrl_play",
    title: "Animation tool",
    content: "Click here to launch the animation window",
	animation: true,
	placement: 'left'
  },
      {
    element: "#ctrl_change_viewer2",
    title: "Change projection",
    content: "Click on the little map to launch the viewer in Web Mercator projection. You will see the approximate scale at the bottom.",
	animation: true,
	placement: 'left'
  },
      {
    element: "#tools",
    title: "Export tools",
    content: "Click on the button on the top-left of the map to export the data currently displayed on the map in several formats: KML, GeoTIFF, JPG, CSV, XLSX and Shapefile",
	animation: true,
	onShown: function () {
		$("#tools_h3").removeClass("contracted");
		$("#tools_h3").parent().find('.content').slideToggle("fast");
		},
	onHidden: function () {
		$("#tools_h3").addClass("contracted");
		$("#tools_h3").parent().find('.content').slideToggle("fast");
		}
  }
],
  storage: false
});

$(document).on("click", "#help", function () {
	tour.init();
	tour.restart();
});