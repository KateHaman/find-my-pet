function initMap() {
    const center = {lat: 49.427673, lng: 32.050320};

    // Declare your map options
    const mapOptions = {
        zoom: 18,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDoubleClickZoom: true,
        mapTypeControl: false,
        streetViewControl: false,
    };


    const map = new google.maps.Map(document.getElementById("map"), mapOptions);

    navigator.geolocation.getCurrentPosition((position) => {
        if (position.coords === undefined) {
            return;
        }
        var latLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };
        new google.maps.Marker({
            position: latLng,
            map: map,
        });
        mapIndex.setCenter(latLng);
    });

    const marker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, -29),
    });
    map.addListener("dblclick", (e) => {
        marker.setPosition(e.latLng);
        setDataDocument(marker);
    });

    initAutocomplete(map, marker);
}

function setDataDocument(marker) {
    document.getElementById("post_place_latitude").value = marker.getPosition().lat();
    document.getElementById("post_place_longitude").value = marker.getPosition().lng();

    const geocoder = new google.maps.Geocoder();
    const latlng = {
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng(),
    };

    geocoder
        .geocode({location: latlng})
        .then((response) => {
            if (response.results[0]) {
                document.getElementById("post_place_name").value = response.results[0].formatted_address;
            }
        });
}

function initAutocomplete(map, marker) {

    const input = document.getElementById("post_place_name");
    const options = {
        fields: ["formatted_address", "geometry", "name"],
        strictBounds: false,
        types: ["establishment"],
    };
    const autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.bindTo("bounds", map);

    autocomplete.addListener("place_changed", () => {
        marker.setVisible(false);
        const place = autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        dsetDataDocument(marker);

    });

}
