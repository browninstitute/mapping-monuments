function geocoder(address) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( {'address': address}, function(results, status) {

        var x = results[0].geometry.location.lat();
        var y = results[0].geometry.location.lng();

        var geojsonMarkerOptions = {
            radius: 60,
            color: "lightgray",
            weight: 1
        };

        var map = L.map('map')
          , targetZoom = 11;

        // Centers the map marker with the overlay on the right side of the screen
        if ($(window).width() > 767) {
          var overlayWidth = $('.map-text').width()
            , targetPoint = map.project([x, y], targetZoom).add([overlayWidth / 2, 0]);
          console.log(overlayWidth);
        }
        // Centers the map marker with the overlay on the bottom of the screen
        else {
          var overlayHeight = $('.map-text').height()
            , targetPoint = map.project([x, y], targetZoom).add([0, overlayHeight / 2]);
        };

        var targetLatLng = map.unproject(targetPoint, targetZoom);;
        map.setView(targetLatLng, targetZoom);

        var layer = Tangram.leafletLayer({
          scene: 'https://raw.githubusercontent.com/tangrams/refill-style/gh-pages/refill-style.yaml',
          attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | <a href="http://www.openstreetmap.org/about" target="_blank">&copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>',
        });
        layer.addTo(map);
        map.scrollWheelZoom.disable();
        var geoJsonFeature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [y, x]
            },
            "properties": {
                "address": address
            }
        }
        L.geoJson(geoJsonFeature, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(feature.properties.address);
            }
        }).addTo(map);
        // L.marker([x, y]).addTo(map);
    });
};
