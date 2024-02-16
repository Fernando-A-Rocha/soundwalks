
let position = null;
let watchId;

const LOCATION_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 10000,
};

const updateLocation = () => {
    const locationSpan = document.getElementById('location');
    if (position) {
        locationSpan.innerHTML = `(${position.coords.latitude}, ${position.coords.longitude})`;
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
});
