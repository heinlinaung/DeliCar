"use strict";

let AutoComplete = function ( map ) {
    let _this = this;
    _this.map = map;
    _this.orgPlaceId = null;
    _this.destPlaceId = null;
    _this.directionsDisplay = new google.maps.DirectionsRenderer;
    _this.directionsService = new google.maps.DirectionsService;
    _this.directionsDisplay.setMap( map );
    _this.directionsDisplay.setPanel(document.getElementById('right-panel'));
    _this.defaultTravelMode = 'DRIVING'

    let pickUpPointAutoComplete = new google.maps.places.Autocomplete(
        document.getElementById('pickup-point'), {
        placeIdOnly: true
    });
    let dropOffPointAutoComplete = new google.maps.places.Autocomplete(
        document.getElementById('dropoff-point'), {
        placeIdOnly: true
    });

    pickUpPointAutoComplete.setComponentRestrictions({
        'country': ['sg']
    });
    dropOffPointAutoComplete.setComponentRestrictions({
        'country': ['sg']
    });

    _this.bindClickEvent('search');
    _this.bindAutoComplete(pickUpPointAutoComplete, 'pickup');
    _this.bindAutoComplete(dropOffPointAutoComplete, 'dropoff');
}

AutoComplete.prototype.bindAutoComplete = function( autocomplete, point ) {
    let _this = this;
    autocomplete.bindTo('bounds', _this.map);
    autocomplete.addListener('place_changed', function() {
        let place = autocomplete.getPlace();
        if ( point === 'pickup') {
            _this.orgPlaceId = place.place_id;
        } else if ( point === 'dropoff' ) {
            _this.destPlaceId = place.place_id;
        }
        _this.checkLocationInputAndProceed();
    });

};

AutoComplete.prototype.bindClickEvent = function( eleId ) {
    let _this = this;
    let goBtn = document.getElementById( eleId );

    goBtn.addEventListener('click', function() {
        _this.travelMode = _this.defaultTravelMode;
        _this.findRoute();
    });
};

AutoComplete.prototype.checkLocationInputAndProceed = function() {
    let _this = this;
    let pickUpPoint = document.getElementById('pickup-point').value.trim();
    let dropOffPoint = document.getElementById('dropoff-point').value.trim();
    if(!pickUpPoint || !dropOffPoint){ return }
    _this.findRoute();
}

AutoComplete.prototype.findRoute = function() {
    let _this = this;
    console.log('_this.orgPlaceId: ',_this.orgPlaceId)
    if (!_this.orgPlaceId || !_this.destPlaceId) { window.alert("Please, check and set your route correctly."); return }

    _this.directionsService.route({
        origin: {
            'placeId': _this.orgPlaceId
        },
        destination: {
            'placeId': _this.destPlaceId
        },
        travelMode: _this.defaultTravelMode
    }, function(res, status) {
        if (status === 'OK') {
            console.log('res: ',res)
            _this.directionsDisplay.setDirections( res );
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
};

function setUpMapHeight(){
    //set the map height
    let windowHeight = window.innerHeight;
    let siteHeaderHeight = document.getElementById('site-header').offsetHeight;
    let map_container = document.getElementById('map-container');
    map_container.style.height = ( windowHeight - siteHeaderHeight - 30 ) + "px";
}

function initializeMap() {
    //Init Google Map
    let map = new google.maps.Map(document.getElementById('map'), {
        mapTypeControl: false,
        scrollwheel:false,
        center: { lat: 1.290270, lng: 103.851959 },
        zoom: 13
    });
    setUpMapHeight();
    new AutoComplete(map);
}