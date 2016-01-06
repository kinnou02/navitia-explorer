function onMapClick(e) {
	popup
		.setLatLng(e.latlng)
		.setContent("LatLon : " + e.latlng.lat + ", "+e.latlng.lng)
		.openOn(map);
}


function getTraff(){
	url="coverage/"+coverage+"/routes/"+t["route_id"]+"/route_schedules/";
    ///stop_schedules?calendar=idcalenddar1
    //http://confluence.canaltp.fr/display/METH/Interactions+avec+NAViTiA
	url+="?from_datetime=" + natural_str_to_iso(
		document.getElementById("date").value, 
		document.getElementById("heure").value);
	callNavitia(ws_name, url, function(response){
		if (response.route_schedules) {
			schedule = response.route_schedules[0]; //1 seule grille sur un parcours
			show_schedule_html();
		}
	});
}
	
function show_schedule_html(){
	str="<table border='1px' style='font-size:10px;>";
	str+="<thead>";
	str+="<tr><td>&nbsp;</td>";
	for (var i in schedule.table.headers){
		item=schedule.table.headers[i];
		for (var li in item.links){
			link=item.links[li];
			if (link.type=="vehicle_journey") {
				item.vehicle_journey_id=link.id;
			}
		}
		str+="<td>";
		//str+=item.vehicle_journey_id+"<br>";
		//str+=item.display_informations.direction+"<br>";
		str+="</td>";
	}
	str+="</tr>"
	str+="</thead>";
	str+="<tbody  style='display: block; border: 1px solid green; height: 500px; overflow: scroll;'>";
	for (var i in schedule.table.rows){
		row=schedule.table.rows[i];
		str+="<tr>";
		str+="<td>"+row.stop_point.label.replace(/ /g, "&nbsp;")+"</td>";
		for (var j in row.date_times){
			dt=row.date_times[j];
			if (dt.date_time) {
				var myDate = IsoToJsDate(dt.date_time);
				str+="<td>"+formatDate(myDate, "hh:nn:ss")+"</td>";
			} else {
				str+="<td>&nbsp;</td>"
			}
		}
		str+="</tr>"
	}
	str+="</tbody>";
	str+="</table>";
	document.getElementById("route_schedules_div").innerHTML=str;
}

function route_schedule_onLoad(){
	menu.show_menu("menu_div");
	t=extractUrlParams();

	init_date();

	if (t["date"]) { document.getElementById("date").value=decodeURIComponent(t["date"]);}
	if (t["heure"]) { document.getElementById("heure").value=decodeURIComponent(t["heure"]);}

	getNetworkSelect();
	getLineSelect();
	getRouteSelect();
	getRouteSchedule();

	map = L.map('map-canvas').setView([48.837212, 2.413], 8);
	// add an OpenStreetMap tile layer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	map.on('click', onMapClick);

}

var selected = null;
var map;
var popup = L.popup();
var t;
var schedule;

