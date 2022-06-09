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

    // Create a map in the #map HTML element, using the declared options
    const map = new google.maps.Map(document.getElementById("map"), mapOptions);
    
    const marker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, -29),
    });

    map.addListener("dblclick", (e) => {
         placeMarkerAndPanTo(e.latLng, map, marker);
     });

    navigator.geolocation.getCurrentPosition((position) => {
        if (position.coords == undefined) {
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
        map.setCenter(latLng);
    });

    initAutocomplete(map, marker);

}

function placeMarkerAndPanTo(latLng, map, marker) {

    console.log(latLng);

    const petInfo = `<h1>INfo</h1>`

    const infoWindow = new google.maps.InfoWindow({
        content: petInfo,
    });

    marker.setPosition(latLng);

    marker.addListener("click", () => {
        infoWindow.open({
            anchor: marker,
            map,
            shouldFocus: false,
        });
    });

    //map.panTo(latLng);
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

        document.getElementById("post_place_latitude").value = marker.getPosition().lat();
        document.getElementById("post_place_longitude").value = marker.getPosition().lng();

    });

    strictBoundsInputElement.addEventListener("change", () => {
        autocomplete.setOptions({
            strictBounds: strictBoundsInputElement.checked,
        });
        if (strictBoundsInputElement.checked) {
            biasInputElement.checked = strictBoundsInputElement.checked;
            autocomplete.bindTo("bounds", map);
        }

        input.value = "";
    });

}

function initLostPetsMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 18,
    center: {lat: 49.427673, lng: 32.050320},
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDoubleClickZoom: true,
    mapTypeControl: false,
    streetViewControl: false,
  });

  const lost_pets = document.querySelectorAll("div.lost-pet-card");

  lost_pets.forEach(lost_pet => {
    const marker = new google.maps.Marker({
      position: {
        lat: Number(lost_pet.getAttribute("data-latitude")),
        lng: Number(lost_pet.getAttribute("data-longitude"))
      },
      map: map
    });

    const infoWindow = new google.maps.InfoWindow({
      content: lost_pet.getAttribute("data-name"),
    });

    marker.addListener("click", () => {
      infoWindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
      });
    });
  })
}
