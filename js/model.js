(function () {
    'use strict';

    var win = window,
        doc = document,
        RB = win.RB || {};

    RB = (function () {
        var mapOptions, 
            map,
            marker,
            geocoder,
            bache = {
                lat: '',
                lng: '',
                address: '',
                dateCreated: '',
                fixInProgress: false,
                dateFixed: '',
                timesReported: 0,
                severity: 0
            },
            mapEl = doc.getElementById('map-canvas'),
            reportButton = document.getElementById('report-bache');

        function _loadGoogleMaps (callback) {

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

            google.maps.event.addListener(map, 'click', mapEventHandler);

            reportButton.addEventListener('click', reportButtonHandler, false);
        }

        function mapEventHandler(e) {
                
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
                        //console.log(address.formatted_address);

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

        function reportButtonHandler (e) {

            e.preventDefault();

            saveBache();
        }

        function saveBache() {

            // Just if a marker is present in the map
            if (marker && bache) {
                // TODO: Save this bache to LocalStorage
            }

        }

        return {
            loadGoogleMaps: _loadGoogleMaps,

            initializeMap: _initializeMap
        }
    })();

    win.RB = RB;

})();