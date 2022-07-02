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
    const mapG = new google.maps.Map(document.getElementById("map"), mapOptions);

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
            map: mapG,
        });
        mapG.setCenter(latLng);
    });

    const infowindow = new google.maps.InfoWindow();

    const icons = {
        catRed: "/assets/catRed.png",
        catGreen: "/assets/catGreen.png",
        dogRed: "/assets/dogRed.png",
        dogGreen: "/assets/dogGreen.png",
    };
    const pets = document.querySelectorAll("div.pet-card");

    const mapMarkers = new Map;

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
            map: mapG,
            title: pet.getAttribute("data-name"),
            optimized: true,
            zIndex: 3
        });

        let id = pet.getAttribute("data-id");
        let name = pet.getAttribute("data-name");
        let content = pet.getAttribute("data-content");
        const contentString = `
            <div id="content">
                <a href="/posts/${id}">${name}</a>
                <div>
                    ${content}
                 </div>
            </div>`;
        mapMarkers.set(marker, contentString);

        marker.addListener('click', () => {
            infowindow.setContent(mapMarkers.get(marker));
            infowindow.open(marker.getMap(), marker);
        });

    });

    const el = document.getElementById("dataPosts");
    el.remove();

}
