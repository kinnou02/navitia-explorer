String.prototype.endsWith = function(suffix) {
	//console.log("suffix : " + suffix);
	//console.log("suffix length : " + suffix.length);
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function extractUrlParams () {
	var t = location.search.substring(1).split('&');
	var f = [];
	for (var i=0; i<t.length; i++){
		var x = t[ i ].split('=');
		x[1]=decodeURI(x[1]);
		x[1]=x[1].replace(/\+/g, " ");
		x[1]=x[1].replace(/\"/g, "");
		x[1]=x[1].replace(/\%3A/g, ":");
		x[1]=x[1].replace(/\%3B/g, ";");
		x[1]=x[1].replace(/\%2F/g, "/");
		if (!f[x[0]]) f[x[0]]=x[1];
		else {
		    if (!( Object.prototype.toString.call( f[x[0]] ) === '[object Array]' )) {
		        //il faut transormer la variable en tableau
		        tmp=f[x[0]];
		        f[x[0]]= new Array();
		        f[x[0]].push(tmp);
		    }
            f[x[0]].push(x[1]);
		}
	}
	return f;
}

function getUrlParams(){
	t=extractUrlParams();
	if (t["region"]) {
		params.region=t["region"];
	}
	return t;
}

function createRequestObject()
{
    var http;
    if (window.XMLHttpRequest)
    { // Mozilla, Konqueror/Safari, IE7 ...
        http = new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    { // Internet Explorer 6
        http = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return http;
} // createRequestObject()

function validateJSON(jsonText)
{
    return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(
                jsonText.replace(/"(\\.|[^"\\])*"/g, '')))
           && eval('(' + jsonText + ')');
} // validateJSON(jsonText)

function callUrl(url, callBack){
	var http = createRequestObject();

	http.open('GET', url, true);
	http.onreadystatechange = (function () {
	  if (http.readyState == 4)
	  {
		if (http.status == 200)
		{
		  return callBack(http.responseText);
		}
	  }
	});
	http.send(null);
}

function callNavitia(ws_name, url, callBack){
	var http = createRequestObject();
	cible="./navitia.php?ws_name="+ws_name+"&ress="+url

	http.open('GET', cible, true);
	http.onreadystatechange = (function () {
	  if (http.readyState == 4)
	  {
		if (http.status == 200)
		{
		  var response = validateJSON(http.responseText);
		  return callBack(response);
		}
	  }
	});
	http.send(null);
}

function callObjectFunction(ws_name, url, object, callBack){
	var http = createRequestObject();
	cible="./navitia.php?ws_name="+ws_name+"&ress="+url
	http.open('GET', cible, true);
	http.onreadystatechange = (function () {
	  if (http.readyState == 4)
	  {
		if (http.status == 200)
		{
		  var response = validateJSON(http.responseText);
		  return callBack(object, response);
		}
	  }
	});
	http.send(null);
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function natural_str_to_iso(date, time) {
    date_a=date.split('/');
    time_a=time.split('h');
    //20140302T120600
    result=date_a[2]+date_a[1]+date_a[0];
    result+='T';
    result+=time_a[0]+time_a[1];
    return result;
}

function strtodatetime(str){
	//20140217T134500
	//new Date(year, month, day, hours, minutes, seconds, milliseconds); 
	y=parseInt(str.substring(0,4));
	m=parseInt(str.substring(4,6));
	d=parseInt(str.substring(6,8));
	h=parseInt(str.substring(9,11));
	M=parseInt(str.substring(11,13));
	s=parseInt(str.substring(13,15));
	date= new Date(y,m,d,h,M,s);
	return date;
}

var formatDate = function (formatDate, formatString) {
	if(formatDate instanceof Date) {
		var months = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
		var yyyy = formatDate.getFullYear();
		var yy = yyyy.toString().substring(2);
		var m = formatDate.getMonth();
		var mmm = months[m];
		m+=1;
		var mm = m < 10 ? "0" + m : m;
		var d = formatDate.getDate();
		var dd = d < 10 ? "0" + d : d;
		
		var h = formatDate.getHours();
		var hh = h < 10 ? "0" + h : h;
		var n = formatDate.getMinutes();
		var nn = n < 10 ? "0" + n : n;
		var s = formatDate.getSeconds();
		var ss = s < 10 ? "0" + s : s;

		formatString = formatString.replace(/yyyy/i, yyyy);
		formatString = formatString.replace(/yy/i, yy);
		formatString = formatString.replace(/mmm/i, mmm);
		formatString = formatString.replace(/mm/i, mm);
		formatString = formatString.replace(/m/i, m);
		formatString = formatString.replace(/dd/i, dd);
		formatString = formatString.replace(/d/i, d);
		formatString = formatString.replace(/hh/i, hh);
		formatString = formatString.replace(/h/i, h);
		formatString = formatString.replace(/nn/i, nn);
		formatString = formatString.replace(/n/i, n);
		formatString = formatString.replace(/ss/i, ss);
		formatString = formatString.replace(/s/i, s);

		return formatString;
	} else {
		return "";
	}
}

function IsoToJsDate(chaine){
	//20140302T120600 
	//var d = new Date(year, month, day, hours, minutes, seconds, milliseconds); 
	var y = chaine.substring(0,4);
	var m = chaine.substring(4,6);
	var d = chaine.substring(6,8);	
	var h = chaine.substring(9,11);	
	var n = chaine.substring(11,13);
	var s = chaine.substring(13,15);
	if (h == "") {
		return new Date(y, m-1, d, 0, 0, 0, 0); 
	} else {	
		return new Date(y, m-1, d, h, n, s, 0); 
	}
}

function dateDiff(d1,d2){
	var WNbJours = d1.getTime() - d2.getTime();
	return Math.ceil(WNbJours/(1000*60*60*24));
}



function distance_wgs84(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = (lat2 - lat1) * Math.PI / 180;  // deg2rad below
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a =
     0.5 - Math.cos(dLat)/2 +
     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
     (1 - Math.cos(dLon))/2;

  dist_km = R * 2 * Math.asin(Math.sqrt(a));
  return Math.trunc(dist_km*1000);
}


function is_coord(params) {
    if (typeof(params)=="string"){
        coord=params.split(";");
        if (coord.length != 2) result=false;
        result= (parseFloat(coord[0] && parseFloat(coord[1])) );
    } else result=false;
    return result;
}


function wkt2geojson(wkt){
    str="";
//POLYGON((0.0524887245 46.34721813,0.0524887245 48.938372,3.128101325 48.938372,3.128101325 46.34721813,0.0524887245 46.34721813))
    if (wkt.search("LINESTRING") == 0){
        geojson = {"type":"Linestring", "coordinates":[]};
        str = wkt.substring("LINESTRING((".length, wkt.length-2);
        coord_list=str.split(",");
        for (var i in coord_list){
            coord=coord_list[i].split(" ");
            geojson.coordinates.push([parseFloat(coord[0]), parseFloat(coord[1])]);
        }
    } else if (wkt.search("POLYGON") == 0){
        geojson = {"type":"Polygon", "coordinates":[[]]};
        str = wkt.substring("POLYGON((".length, wkt.length-2);
        coord_list=str.split(",");
        for (var i in coord_list){
            coord=coord_list[i].split(" ");
            geojson.coordinates[0].push([parseFloat(coord[0]), parseFloat(coord[1])]);
        }

    } else if (wkt.search("MULTIPOLYGON") == 0){
        geojson = {"type":"Polygon", "coordinates":[]};
        str = wkt.substring("MULTIPOLYGON(((".length, wkt.length-3);
        polygon_list = str.split(")");
        for (p in polygon_list) {
            geojson.coordinates[p] = [];
            parenthese_pos = polygon_list[p].search("\\(");
            polygon_str = polygon_list[p].substring(parenthese_pos+1, polygon_list[p].length);
            coord_list=polygon_str.split(",");
            for (var i in coord_list){
                coord=coord_list[i].split(" ");
                geojson.coordinates[p].push([parseFloat(coord[0]), parseFloat(coord[1])]);
            }
        }
    }
    return geojson;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function sort_compare_coverage(cov1, cov2){
	country1 = cov1.id.split('-')[0];
	country2 = cov2.id.split('-')[0];
	if (country1.length != country2.length) {
		//on trie les pays les plus grands en premiers (clients specifiques type transilien)
		return country2.length - country1.length;
	} else {
		//meme taille de pays, on met fr en 1er
		country1 = country1.substring(0, 2);
		country2 = country2.substring(0, 2);
		if (country1 == country2) {
			//on trie par ordre alpha
			return cov1.id.localeCompare(cov2.id);
		}
		if (country1 == "fr") {  return -1;  }
		if (country2 == "fr") {  return 1;  }
	}
	//on trie par ordre alpha
	return cov1.id.localeCompare(cov2.id);
}


function geojsonToGmap(geo){
	result=[];
	for (var i in geo){
		coord=geo[i];
		result.push([coord[1], coord[0]]);
	}
	return result;
}








