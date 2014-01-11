function googleMapsCallback() {
    RB.initializeMap();
}

(function () {

    var win = window,
        RB = win.RB || {};

    RB.loadGoogleMaps('googleMapsCallback');

})();