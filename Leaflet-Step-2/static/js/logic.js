
var dataLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";
var platesLink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";


// add earthquake circles to map
var earthquakeMarkers = [];

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
            return "maroon";
        case depth > 40:
            return "purple";
        case depth > 20:
            return "blue";
        case depth > 10:
            return "red";
        case depth > 1:
            return "orange";
        case depth < 1:
            return "yellow";
        }
    }
    
    for (var i=0; i < locations.length; i++) {
        earthquakeMarkers.push(L.circle([locations[i].geometry.coordinates[1], locations[i].geometry.coordinates[0]], {
            color: "white",
            fillColor: chooseColor(locations[i].geometry.coordinates[2]),
            radius: markerSize(locations[i].properties.mag),
            fillOpacity: 0.8
        }).bindPopup(`<strong>${locations[i].properties.place}</strong><hr>Magnitude: ${locations[i].properties.mag}<br>Depth: ${locations[i].geometry.coordinates[2]}`)
        );
    }
});
console.log(earthquakeMarkers);

// add tectonic plates lines to map
var tectonicPlateLine = [];

d3.json(platesLink, function(response) { 
    tectonicPlateLine.push(L.geoJson(response, {
        color: "#DC143C",
        weight: 2
    }))
});
console.log(tectonicPlateLine);

// create base layers
var earthQuakeMarkersLayer = L.layerGroup(earthquakeMarkers);
var tectonicPlateLineLayer = L.layerGroup(tectonicPlateLine);

// Define Variables for Tile Layers
var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
});

var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
});

var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
});

// Define baseMaps Object to Hold Base Layers
var baseMaps = {
    "Satellite Map": satelliteMap,
    "Light Map": lightMap,
    "Dark Map": darkMap
};

// Create Overlay Object to Hold Overlay Layers
var overLayMaps = {
    "Earthquakes": earthQuakeMarkersLayer,
    "Tectonic Planes": tectonicPlateLineLayer
};

// create map object with options
var myMap = L.map("map-id", {
    center: [39.8283, -98.5795],
    zoom: 4,
    layers: [satelliteMap, earthQuakeMarkersLayer]
});

// create layer control
L.control.layers(baseMaps, overLayMaps).addTo(myMap);



