(function () {
    'use strict';

    var win = window,
        doc = document,
        RB = win.RB || {};

    RB = (function () {
        var mapOptions, 
            map,
            mapEl,
            marker,
            geocoder,
            bache = {
                lat: 0,
                lng: 0,
                address: '',
                dateCreated: '',
                fixInProgress: false,
                dateFixed: '',
                timesReported: 0,
                severity: 0
            },
            markers = [];

        function _loadGoogleMaps (callback, mapElement) {

            mapEl = mapElement;

            var script = doc.createElement('script');

            script.type = 'text/javascript';
            script.src = 'https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyC7FjpRbVeZ6X6YxVX6hdcSd-dAyYVPU1k&sensor=false&libraries=drawing&' +
            'callback=' + callback;

            doc.body.appendChild(script);

        }

        function _initializeMap () {
            mapOptions = {
                zoom: 13,
                center: new google.maps.LatLng(17.999958, -92.926311)
            };

            map = new google.maps.Map(
                mapEl,
                mapOptions
            );

            _loadBaches();

            google.maps.event.addListener(map, 'click', _mapEventHandler);
        }

        function _loadBaches() {
            var bachesJSON,
                i = 0;

            ajax('data/data.json', function (response) {

                bachesJSON = response.response;

                if (bachesJSON) {

                    bachesJSON = JSON.parse(bachesJSON);

                    var bachesJSONLength = bachesJSON.length;

                    if (bachesJSONLength) {

                        var i = 0;

                        for (i ; i < bachesJSONLength; i++) {

                            markers[i] = new google.maps.Marker({
                                animation: google.maps.Animation.DROP,
                                draggable: false,
                                position: new google.maps.LatLng(bachesJSON[i].lat, bachesJSON[i].lng),
                                map: map,
                            });

                        }
                    }

                }

            });

        }

        function _createMarker(latLng) {
            marker = new google.maps.Marker({
                animation: google.maps.Animation.DROP,
                draggable: false,
                position: latLng,
                map: map,
            });
        }

        function _mapEventHandler(e) {
                
            //console.log(e);
            var latLng = e.latLng,
                market;

            // Move marker to user click's
            map.panTo(latLng);

            // Remove previous marker (if exists)
            if (marker) {
                marker.setMap(null);
                marker = null;
            }

            // Create new marker
            marker = new google.maps.Marker({
                animation: google.maps.Animation.DROP,
                draggable: true,
                position: latLng,
                map: map,
            });

            // Reverse geocoding
            geocoder = new google.maps.Geocoder();
            geocoder.geocode({'latLng': latLng}, function(results, status) {

                if (status == google.maps.GeocoderStatus.OK) {

                    var address = results[0];

                    if (address) {

                        bache = {
                            lat: latLng.ob,
                            lng: latLng.pb,
                            address: address.formatted_address,
                            dateCreated: new Date(),
                            fixInProgress: false,
                            dateFixed: '',
                            timesReported: 0,
                            severity: 0
                        };

                    }

                } else {
                    alert("Geocoder failed due to: " + status);
                }

            });

        }

        return {
            loadGoogleMaps: _loadGoogleMaps,

            initializeMap: _initializeMap,

            saveBache: function (e) {
                e.preventDefault();

                // Just if a marker is present in the map
                if (marker && bache) {

                    // TODO: Save this bache to LocalStorage
                    var baches;

                    baches = localStorage.getItem('baches');
                    baches = (baches) ? JSON.parse(baches) : [];

                    console.log(bache);

                    baches.push(bache);

                    baches = JSON.stringify(baches);
                    localStorage.setItem('baches', baches);

                    ajax('php/saveJSON.php?baches=' + baches , function () {
                        console.log('AJAX!!');
                    });

                }

            }
        }
    })();

    win.RB = RB;

})();