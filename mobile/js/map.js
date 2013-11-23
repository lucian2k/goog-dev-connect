'use strict';

angular.module('directives')
.directive('map', function($compile, $parse) {
    var tileServer = 'https://dnv9my2eseobd.cloudfront.net/v3/foursquare.map-ikj05elx/{z}/{x}/{y}.png';
    return {
        restrict: 'E',
        replace: true,
        scope: {
            center: "=",
            zoom: "=",
            lat: "=",
            lng: "="
        },
        template: '<div id="map"></div>',
        link: function (scope, element, attrs, ctrl) {
            var $el = element[0],
                    map = new L.Map($el),
                        layer_group = new L.layerGroup();;

                scope.zoom = scope.zoom || 4;
                scope.lat = scope.lat || 50;
                scope.lng = scope.lng || 12;

                L.tileLayer(tileServer, { maxZoom: 16 }).addTo(map);

            // Default center of the map
            var point = new L.LatLng(scope.lat, scope.lng);
            map.setView(point, scope.zoom);

            var selections = $parse(attrs.markers)(scope);
            layer_group.clearLayers();
            angular.forEach(selections, function(selection, index) {
                if (!angular.isString(selection) && selection.latitude && selection.longitude) {
                    var position = { lat: selection.latitude, lng: selection.longitude },
                        marker = new L.marker(position, {icon: L.icon({iconUrl: '/images/marker-icon.png', shadowUrl: '/images/marker-shadow.png',})});
                    try {
                        map.fitBounds(marker.getBounds());
                    } catch (err) {
                        map.setView(position, scope.zoom)
                    }
                    marker.addTo(layer_group);
                }
            });

            layer_group.addTo(map);

            scope.$watch("center", function(center) {
                if (center === undefined) return;

                // Center of the map
                center = new L.LatLng(scope.center.lat, scope.center.lng);
                var zoom = scope.zoom || 8;
                map.setView(center, zoom);

                // Listen for map drags
                var dragging_map = false;
                map.on("dragstart", function(e) {
                    dragging_map = true;
                });

                        map.on("drag", function (e) {
                                scope.$apply(function (s) {
                                        s.center.lat = map.getCenter().lat;
                                        s.center.lng = map.getCenter().lng;
                                });
                        });

                map.on("dragend", function(e) {
                    dragging_map= false;
                });

                scope.$watch("center.lng", function (newValue, oldValue) {
                    if (dragging_map) return;
                    map.setView(new L.LatLng(map.getCenter().lat, newValue), map.getZoom());
                });

                scope.$watch("center.lat", function (newValue, oldValue) {
                    if (dragging_map) return;
                    map.setView(new L.LatLng(newValue, map.getCenter().lng), map.getZoom());
                });

                // Listen for zoom
                scope.$watch("zoom", function (newValue, oldValue) {
                    map.setZoom(newValue);
                });

                map.on("zoomend", function (e) {
                    scope.zoom = map.getZoom();
                    scope.$apply();
                });
            });

        }
    };
});