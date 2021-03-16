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
            case depth > 100:
                return "maroon";
            case depth > 80:
                return "purple";
            case depth > 60:
                return "blue";
            case depth > 40:
                return "red";
            case depth > 20:
                return "orange";
            case depth > 1:
                return "yellow";
            default:
                return "white"
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

    // Set Up Legend
    var legend = L.control({ position: "bottomleft" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"), 
        magnitudeLevels = [0, 1, 20, 40, 60, 80, 100];

        div.innerHTML += "<h3>Depth</h3>"

        for (var i = 0; i < magnitudeLevels.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + chooseColor(magnitudeLevels[i]+1) + '"></i> ' +
                magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
        }
        return div;
    };
    // Add Legend to the Map
    legend.addTo(myMap);
});



