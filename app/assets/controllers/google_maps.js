function initMap() {

    const center = {lat: 49.427673, lng: 32.050320};

    // Declare your map options
    const mapOptions = {
        zoom: 18,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
    };

    // Create a map in the #map HTML element, using the declared options
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
        map.setCenter(latLng);
    });

    const icons = {
        catRed: "/assets/catRed.png",
        catGreen: "/assets/catGreen.png",
        dogRed: "/assets/dogRed.png",
        dogGreen: "/assets/dogGreen",
    };
    const pets = document.querySelectorAll("div.pet-card");

    pets.forEach(pet => {
        const category = Number(pet.getAttribute("data-category"));
        const species = pet.getAttribute("data-species");
        const iconId = species + (category === 8 ? "Red" : "Green");

        const marker = new google.maps.Marker({
            position: {
                lat: Number(pet.getAttribute("data-latitude")),
                lng: Number(pet.getAttribute("data-longitude"))
            },
            icon: icons[iconId],
            map: map
        });

        const contentString =
            '<div id="content">' +
            '<a href="/posts/' + pet.getAttribute("data-id") + '">' + pet.getAttribute("data-name") + '</a>' +
                '<div>' +
                    pet.getAttribute("data-content") +
                '</div>' +
            '</div>';
        const infowindow = new google.maps.InfoWindow({
            content: contentString,
        });

        marker.addListener("click", () => {
            infowindow.open({
                anchor: marker,
                map: map,
                shouldFocus: false,
            });
        });


    });

}
