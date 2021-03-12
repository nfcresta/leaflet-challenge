
var dataLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";
var platesLink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Initialize & Create Two Separate LayerGroups: earthquakes & tectonicPlates
var earthquakes = new L.LayerGroup();
var tectonicplates = new L.LayerGroup();

// createMap function
function createMap(earthquakes, tectonicplates) {
    // Define Variables for Tile Layers
    var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    var grayscaleMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    var outdoorsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });

    // Define baseMaps Object to Hold Base Layers
    var baseMaps = {
        "Satellite Map": satelliteMap,
        "Grayscale Map": grayscaleMap,
        "Outdoors Map": outdoorsMap
    };

    // Create Overlay Object to Hold Overlay Layers
    var overLayMaps = {
        "Earthquakes": earthquakes,
        "Tectonic Planes": tectonicplates
    };

    // create map object with options
    var myMap = L.map("map-id", {
        center: [39.8283, -98.5795],
        zoom: 4,
        layers: [satelliteMap, earthquakes]
    });

    // create layer control
    L.control.layers(baseMaps, overLayMaps).addTo(myMap);
}

function createEarthquakeMarkers(response) {
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
    
    var earthquakeMarkers = [];
    
    for (var i=0; i < locations.length; i++) {
        earthquakeMarkers.push(L.circle([locations[i].geometry.coordinates[1], locations[i].geometry.coordinates[0]], {
            color: "white",
            fillColor: chooseColor(locations[i].geometry.coordinates[2]),
            radius: markerSize(locations[i].properties.mag),
            fillOpacity: 0.8
        }).bindPopup(`<strong>${locations[i].properties.place}</strong><hr>Magnitude: ${locations[i].properties.mag}<br>Depth: ${locations[i].geometry.coordinates[2]}`)
        );
    }

    // create a lyer group made from earthquakes, pass it in create map function
    var earthquakeMarkerLayer = L.layerGroup(earthquakeMarkers);
    createMap(earthquakeMarkerLayer);
}

function createTectonicPlateMarkers(response) {
    var tectonicPlateLine = [];
    tectonicPlateLine.push(L.geoJson(response, {
        color: "#DC143C",
        weight: 2
    }))
    var tectonicPlateLineLayer = L.layerGroup(tectonicPlateLine);
    tectonicPlateLineLayer.addTo(myMap);
}

d3.json(dataLink, createEarthquakeMarkers);
d3.json(platesLink, createTectonicPlateMarkers);
