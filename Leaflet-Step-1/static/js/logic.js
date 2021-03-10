// Create our initial map object
// Set the longitude, latitude, and the starting zoom level
var myMap = L.map("mapid", {
    center: [39.8283, -98.5795],
    zoom: 5
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
var dataLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(dataLink, function(response) {
    console.log(response);
    var locations = response.features;

    // create function to enlarge markers
    function markerSize(marker) {
        return marker * 100;
    }

    // Function to Determine Color of Marker Based on the Magnitude of the Earthquake
    function chooseColor(magnitude) {
        switch (true) {
        case magnitude > 5:
            return "#581845";
        case magnitude > 4:
            return "#900C3F";
        case magnitude > 3:
            return "#C70039";
        case magnitude > 2:
            return "#FF5733";
        case magnitude > 1:
            return "#FFC300";
        default:
            return "#DAF7A6";
        }
    }

    for (var i=0; i < locations.length; i++) {
        L.circle([locations[i].geometry.coordinates[1], locations[i].geometry.coordinates[0]], {
            color: "black",
            fillColor: chooseColor(locations[i].properties.mag),
            radius: markerSize(locations[i].geometry.coordinates[2])
        }).bindPopup(`<strong>${locations[i].properties.place}</strong><hr>Magnitude: ${locations[i].properties.mag}`)
          .addTo(myMap);
    }
});
