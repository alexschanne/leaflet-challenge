//linking URL
var quakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
console.log(quakeURL)

//map layers
//Satellite
var satMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetMap.org/\">OpenstreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
});

//dark
var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var Outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  //base map
  var base = {
    darkmap: darkMap,
    Satellite: satMap,
    Outdoors:Outdoors
  };

  var layers = {
    layer01: new L.LayerGroup(),
    layer12: new L.LayerGroup(),
    layer23: new L.LayerGroup(),
    layer34: new L.LayerGroup(),
    layer45: new L.LayerGroup(),
    layer5plus: new L.LayerGroup()
  };
  
  // Create the map with our layers
  var map = L.map("mapid", {
    center: [39.876019, -117.224121],
    zoom: 6,
    layers: [
      layers.layer01,
      layers.layer12,
      layers.layer23,
      layers.layer34,
      layers.layer45,
      layers.layer5plus
    ]
  });
  
  // Add our satellite tile layer to the map
satMap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "0-1": layers.layer01,
  "1-2": layers.layer12,
  "2-3": layers.layer23,
  "3-4": layers.layer34,
  "4-5": layers.layer45,
  "5+":layers.layer5plus
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(base, overlays).addTo(map);

// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend")
  return div;
};


// Add the info legend to the map
info.addTo(map);

// Initialize an object containing icons for each layer group
var color = {
  layer01:  "greenyellow",
  layer12: "yellow",
  layer23: "gold",
  layer34: "orange",
  layer45:"darkorange",
  layer5plus:"tomato"
};

// Perform an API call to the quakedata
d3.json(quakeURL, function(quakeData) {
    quakeDataArray = quakeData.features

    var quakeRange;
    
          
    // Loop through the data
    for (var i = 0; i < quakeDataArray.length; i++) {
    //   console.log(quakeDataArray[0]);
      var latitude =quakeDataArray[i].geometry.coordinates[1];
      var longitude =quakeDataArray[i].geometry.coordinates[0];
      var magnitude = quakeDataArray[i].properties.mag;
   
      if (magnitude > 5){
        quakeRange="layer5plus";
      }
      else if (magnitude > 4){
        quakeRange="layer45";
      }
      else if(magnitude > 3){
        quakeRange="layer34";
      }
      else if(magnitude > 2){
        quakeRange="layer23";
      }
      else if(magnitude >1){
        quakeRange="layer12";
      }
      else{
        quakeRange="layer01";
      }
      
    
    var newMarker = L.circleMarker([latitude, longitude],
      {radius: magnitude*8,
        fillOpacity: 1,
        fillColor: color[quakeRange],
        color: "black",
        weight: 1});
    newMarker.addTo(layers[quakeRange]);   

   newMarker.bindPopup("Place: " + quakeDataArray[i].properties.place + "<br> Magnitude: " + magnitude +"<br>");
    
  updateLegend();
   
  };

});


function updateLegend() {
  document.querySelector(".legend").innerHTML = [
    "<p class='layer01'>0-1" + "</p>",
    "<p class='layer12'>1-2" + "</p>",
    "<p class='layer23'>2-3" + "</p>",
    "<p class='layer34'>3-4" + "</p>",
    "<p class='layer45'>4-5" + "</p>",
    "<p class='layer5plus'>5+" + "</p>"
  ].join("");
}
