// Create our initial map object
// Set the longitude, latitude, and the starting zoom level
var myMap = L.map("map-id", {
    center: [39.8283, -98.5795],
    zoom: 4
});

// add tile layer to map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// create circles
var dataLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

d3.json(dataLink, function(response) {
    console.log(response);
    var locations = response.features;

    // create function to enlarge markers
    function markerSize(marker) {
        return marker * 20000;
    }

    // Function to Determine Color of Marker Based on the Magnitude of the Earthquake
    function chooseColor(depth) {
        switch (true) {
        case depth > 50:
            return "black";
        case depth > 40:
            return "purle";
        case depth > 20:
            return "maroon";
        case depth > 10:
            return "red";
        case depth > 1:
            return "orange";
        default:
            return "yellow";
        }
    }

    for (var i=0; i < locations.length; i++) {
        L.circle([locations[i].geometry.coordinates[1], locations[i].geometry.coordinates[0]], {
            color: "white",
            fillColor: chooseColor(locations[i].geometry.coordinates[2]),
            radius: markerSize(locations[i].properties.mag),
            fillOpacity: 0.75
        }).bindPopup(`<strong>${locations[i].properties.place}</strong><hr>Magnitude: ${locations[i].properties.mag}<br>Depth: ${locations[i].geometry.coordinates[2]}`)
          .addTo(myMap);
    }
});

// set up the legend
var legend = L.control({ position: "bottomleft" });


