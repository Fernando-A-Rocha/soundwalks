
let position = null;
let watchId;

let map;
const MAP_ZOOM = 16;

const LOCATION_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 10000,
};

const updateLocation = () => {
    const locationSpan = document.getElementById('location');
    if (position) {
        locationSpan.innerHTML = `(${position.coords.latitude}, ${position.coords.longitude})`;
        map.setView([position.coords.latitude, position.coords.longitude], MAP_ZOOM);
    }
    else {
        locationSpan.innerHTML = 'Unknown';
    }
}

const locationWatchSuccessCallback = (position1) => {
    console.log(position1);
    position = position1;
    updateLocation();
};

const locationWatchErrorCallback = (error) => {
    console.log(error);
    position = null;
    updateLocation();
}

const locationSuccessCallback = (position1) => {
    console.log(position1);
    position = position1;
    updateLocation();

    watchId = navigator.geolocation.watchPosition(locationWatchSuccessCallback, locationWatchErrorCallback, LOCATION_OPTIONS);
};

const locationErrorCallback = (error) => {
    console.log(error);
    position = null;
    updateLocation();
};

document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");

    navigator.geolocation.getCurrentPosition(locationSuccessCallback, locationErrorCallback, LOCATION_OPTIONS);

    map = L.map('map').setView([41.17770, -8.60196], MAP_ZOOM);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> - Fernando Rocha'
    }).addTo(map);
});
