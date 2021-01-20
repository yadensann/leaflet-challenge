// Visualizing Data with Leaflet

// All Earthquakes in the last 7 days GeoJSON URL variables
var earthquake_url=  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// Create LayerGroup for earthquakes
var earthquake_layer= new L.LayerGroup();
var satellite_layer= new L.LayerGroup();
var light_layer= new L.LayerGroup();

// Variables for tile layers
var satellite_map = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
});

var light_mode= L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
});

// Define baseMaps Object to Hold Base Layers
var baseMaps = {
    "Satellite": satellite_map,
    "Light": light_mode,
};

// Create Overlay Object to Hold Overlay Layers
var overlayMaps = {
    "Earthquakes": earthquake_layer
};

// Create Map, Passing In satelliteMap & earthquakes as Default Layers to Display on Load
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 2,
    layers: [satellite_map, light_mode, earthquake_layer]
});

// Adding layer control to map
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// Retrieve earthquake data with D3
d3.json(earthquake_url, function(earthquake_data) {
    // Function for marker size based on magnitude of earthquake
    function marker_size(magnitude) {
        if(magnitude === 0) {
            return 1;
        }
        return magnitude * 3;
    }
    function marker_style(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: choose_color(feature.properties.mag),
            color: "#000000",
            radius: marker_size(feature.properties.mag),
            stroke: true,
            weight: 0.5
          };
        }
    // Function to Determine Color of Marker Based on the Magnitude of the Earthquake. Nothing was under the magnitude of 3.
    function choose_color(magnitude) {
        switch (true) {
        case magnitude > 5:
            return "#581845";
        case magnitude > 4:
            return "#900C3F";
        case magnitude > 3:
            return "#C70039";
        case magnitude > 2:
            return "#eecc00";
        case magnitude > 1:
            return "#d4ee00";
        default:
            return "#98ee00";
        }
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
        // Run the onEachFeature function once for each piece of data in the array
    L.geoJSON(earthquake_data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: marker_style,
        onEachFeature: function(feature, layer) {
            layer.bindPopup(("<h4>Location: " + feature.properties.place + 
            "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
            "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>")
        )}
    }).addTo(earthquake_layer)
    earthquake_layer.addTo(myMap);


    // function get_color(d) {
    //     return d > 5 ? '#581845' :
    //             d > 4  ? '#900C3F' :
    //             d > 3  ? '#C70039' :
    //             d > 2  ? '#eecc00' :
    //             d > 1  ? '#d4ee00' :
    //                     '#98ee00';
    //     }

    var legend= L.control ({
        position: "topleft"
    });

    legend.onAdd = function() {
    var div = L
      .DomUtil
      .create("div", "info legend");
    
    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
    ];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: " + get_color[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
        return div;
    };

    legend.addTo(myMap);
});










    //         radius: radius_size(earthquake_data.properties.mag),
    //         color: circle_color(earthquake_data.properties.mag),
    //         fillOpacity: 1
    //     });
    //     },
    //     onEachFeature: 
    // });

    // // Sending our earthquakes layer to the createMap function
    // createMap(earthquakes);
    // });

