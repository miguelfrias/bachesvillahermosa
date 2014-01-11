function googleMapsCallback() {
    RB.initializeMap();
}

(function () {

    var win = window,
        doc = document,
        RB = win.RB || {},
        map = doc.getElementById('map-canvas'),
        reportBache = doc.getElementById('report-bache');

    RB.loadGoogleMaps('googleMapsCallback', map);

    reportBache.addEventListener('click', RB.saveBache, false);

})();