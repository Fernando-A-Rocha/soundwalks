let narrativePoints = {};

function prepareFormForNextPoint() {
    document.getElementById('pointForm').reset();
    document.getElementById('nextPointsContainer').innerHTML = `
        <label for="nextPointId">Next Point ID</label>
        <input type="text" class="form-control" placeholder="2" id="nextPointId">
    `;
    outputNarrative();
}

document.getElementById('pointForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const idInput = document.getElementById('pointId');
    let id = parseInt(idInput.value);
    if (Number.isNaN(id || id < 0)) {
        alert('Point ID must be a positive integer');
        return;
    }

    if (narrativePoints[id]) {
        alert('Point ID ' + id + ' already exists');
        return;
    }

    // Check if has previous and if previous was final
    // if (id > 1 && narrativePoints[id - 1].final) {
    //     alert('Previous point was final, cannot add a new point');
    //     return;
    // }

    let locationLat = document.getElementById('locationLat').value;
    let locationLon = document.getElementById('locationLon').value;
    let location = null;
    if (locationLat && locationLon && locationLat !== '' && locationLon !== '') {
        locationLat = parseFloat(locationLat);
        locationLon = parseFloat(locationLon);
        if (Number.isNaN(locationLat) || Number.isNaN(locationLon)) {
            alert('Location coordinates must be numbers');
            return;
        }
        location = {
            lat: locationLat,
            lon: locationLon
        };
    }
    
    const nextPointsElements = document.querySelectorAll('#nextPointsContainer > input');
    
    let nextPoints = [];
    let cancel = false;
    nextPointsElements.forEach(function(input) {
        if (input.value === '') {
            if (id === 1) {
                alert('Next Point ID cannot be empty for the first point');
                cancel = true;
                return;
            }
            nextPoints = null;
        }
        else {
            let nextPointId = parseInt(input.value);
            if (Number.isNaN(nextPointId) || nextPointId < 0) {
                alert('Next Point ID must be a positive integer');
                cancel = true;
                return;
            }
            nextPoints.push(nextPointId);
        }
    });
    if (cancel) {
        return;
    }
    
    narrativePoints[id] = {}
    if (nextPoints) {
        narrativePoints[id].nextPoints = nextPoints;
    } else {
        narrativePoints[id].final = true;
    }
    if (location) {
        narrativePoints[id].location = location;
    }
    
    prepareFormForNextPoint();

    idInput.value = id + 1;
    document.getElementById('nextPointId').value = id + 2;
});

function addNextPointField() {
    const container = document.getElementById('nextPointsContainer');
    container.insertAdjacentHTML('beforeend', `
        <label for="nextPointId">Next Point ID</label>
        <input type="text" class="form-control" placeholder="2" id="nextPointId">
    `);
}

function clearForm() {
    if (!confirm('Are you sure you want to clear the form?')) {
        return;
    }
    narrativePoints = {};
    prepareFormForNextPoint();
}

function undoAddNextPoint() {
    const container = document.getElementById('nextPointsContainer');
    const labels = container.querySelectorAll('label');
    const inputs = container.querySelectorAll('input');
    if (inputs.length > 1) {
        container.removeChild(labels[labels.length - 1]);
        container.removeChild(inputs[inputs.length - 1]);
    }
}

function getSoundwalk() {
    
    const title = document.getElementById('soundwalkTitle').value;
    let soundwalk = {
        title: title,
        points: narrativePoints
    };

    return soundwalk;
}

function outputNarrative() {
    document.getElementById('narrativeOutput').textContent = JSON.stringify(getSoundwalk(), null, 2);
}

document.addEventListener("DOMContentLoaded", function() {
    outputNarrative();
});

function downloadSoundwalk() {
    const soundwalk = getSoundwalk();
    if (soundwalk.title === '' || Object.keys(soundwalk.points).length === 0) {
        alert('Soundwalk title or points missing');
        return;
    }

    const narrativeJson = JSON.stringify(soundwalk, null, 2);

    const dateStr = new Date().toLocaleString('en-GB').replace(/ /g, '_').replace(/:/g, '-').replace(/,/g, '');

    const blob = new Blob([narrativeJson], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soundwalk_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importFromFile() {
    const fileInput = document.getElementById('formFileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert('No file selected');
        return;
    }

    // Parse JSON file, output error if not valid JSON according to the soundwalk format ^^
    const reader = new FileReader();
    reader.onload = function(event) {
        const soundwalk = JSON.parse(event.target.result);
        if (!soundwalk) {
            alert('Invalid JSON file');
            return;
        }
        if (!soundwalk.title || !soundwalk.points) {
            alert('Invalid soundwalk format: missing title or points');
            return;
        }
        narrativePoints = soundwalk.points;
        document.getElementById('soundwalkTitle').value = soundwalk.title;
        prepareFormForNextPoint();

        // find the highest point id
        let id = 1;
        for (const pointId in narrativePoints) {
            id = Math.max(id, parseInt(pointId));
        }
        document.getElementById('pointId').value = id + 1;
        document.getElementById('nextPointId').value = id + 2;

        alert("Soundwalk imported successfully:\n" + soundwalk.title);
    };

    reader.readAsText(file);
}