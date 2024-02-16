
let position = null;
let watchId;

let map;
let userMarker;
const MAP_ZOOM = 19;
let initialUpdate = true;

const LOCATION_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 10000,
};

const TEST_POINTS = [
    { lat: 41.17679, lon: -8.60321 },
    { lat: 41.17687, lon: -8.60272 },
];

const updateLocation = () => {
    const locationSpan = document.getElementById('location');
    if (position) {
        locationSpan.innerHTML = `(${position.coords.latitude}, ${position.coords.longitude})`;
        if (initialUpdate) {
            map.setView([position.coords.latitude, position.coords.longitude], MAP_ZOOM);
            initialUpdate = false;
        }
        userMarker.setLatLng([position.coords.latitude, position.coords.longitude]);
    }
    else {
        locationSpan.innerHTML = 'Unknown / Not allowed';
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

    map = L.map('map').setView([41.17706, -8.60294], MAP_ZOOM);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> - Fernando Rocha'
    }).addTo(map);
    userMarker = L.marker([41.17660, -8.60339]).addTo(map);
    userMarker.bindPopup("<b>My current location</b><br>Automatically updated").openPopup();

    TEST_POINTS.forEach((point, index) => {
        var circle = L.circle([point.lat, point.lon], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 5
        }).addTo(map);
        circle.bindPopup("<b>Test point " + index + "</b><br>Lat: " + point.lat + "<br>Lon: " + point.lon);
    });
});
