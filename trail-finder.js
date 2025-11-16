let map = null;
let trailMarkers = [];

// Navigation
document.getElementById('mywalks-tab')?.addEventListener('click', () => {
    window.location.href = 'walkscreen.html';
});
document.getElementById('walkrecs-tab')?.addEventListener('click', () => {
    window.location.href = 'walkrecs.html';
});
document.getElementById('profile-tab')?.addEventListener('click', () => {
    window.location.href = 'profile.html';
});

// Geocode location using Nominatim (OpenStreetMap)
async function geocodeLocation(location) {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
    );
    const data = await response.json();
    if (data.length > 0) {
        return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon)
        };
    }
    throw new Error("Location not found");
}

// Find trails using Overpass API (OpenStreetMap)
async function findTrails(lat, lon, radiusMiles = 10) {
    const radiusMeters = radiusMiles * 1609.34; // Convert miles to meters
    
    // only get named trails and parks to reduce load
    const query = `
        [out:json][timeout:15];
        (
            way["highway"="path"]["name"](around:${radiusMeters},${lat},${lon});
            way["highway"="footway"]["name"](around:${radiusMeters},${lat},${lon});
            way["leisure"="park"]["name"](around:${radiusMeters},${lat},${lon});
        );
        out center 20;
    `;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('Trail search failed');
        }

        const data = await response.json();
        return processTrailData(data, lat, lon);
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Search timed out - try a smaller radius or different location');
        }
        throw error;
    }
}

// Process trail data from Overpass API
function processTrailData(data, userLat, userLon) {
    const trails = [];
    
    if (!data.elements || data.elements.length === 0) {
        return trails;
    }

    data.elements.forEach(element => {
        if (element.center) {
            const distance = calculateDistance(userLat, userLon, element.center.lat, element.center.lon);
            
            trails.push({
                name: element.tags?.name || 'Unnamed Trail',
                type: element.tags?.highway || element.tags?.leisure || 'trail',
                lat: element.center.lat,
                lon: element.center.lon,
                distance: distance.toFixed(1),
                surface: element.tags?.surface || 'Unknown',
                description: element.tags?.description || ''
            });
        }
    });

    // Remove duplicates and sort by distance
    const uniqueTrails = Array.from(new Map(trails.map(t => [t.name, t])).values());
    return uniqueTrails.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)).slice(0, 10);
}

// Calculate distance between two points 
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Initialize map
function initMap(lat, lon) {
    const mapDiv = document.getElementById('map');
    mapDiv.style.display = 'block';

    if (map) {
        map.remove();
    }

    map = L.map('map').setView([lat, lon], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add user location marker
    L.marker([lat, lon], {
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41]
        })
    }).addTo(map).bindPopup('Your Location');

    trailMarkers = [];
}

// Add trail markers to map
function addTrailMarkers(trails) {
    trails.forEach((trail, index) => {
        const marker = L.marker([trail.lat, trail.lon], {
            icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41]
            })
        }).addTo(map);

        marker.bindPopup(`<b>${trail.name}</b><br>${trail.distance} miles away`);
        trailMarkers.push(marker);
    });
}

// Display trails list
function displayTrails(trails) {
    const trailsList = document.getElementById('trails-list');
    trailsList.style.display = 'block';
    trailsList.innerHTML = '<h2>Nearby Walking Trails</h2>';

    if (trails.length === 0) {
        trailsList.innerHTML += '<p>No trails found in this area. Try a different location!</p>';
        return;
    }

    trails.forEach(trail => {
        const trailItem = document.createElement('div');
        trailItem.classList.add('trail-item');
        trailItem.innerHTML = `
            <h3>${trail.name}</h3>
            <p><strong>Distance:</strong> ${trail.distance} miles away</p>
            <p><strong>Type:</strong> ${trail.type}</p>
            <p><strong>Surface:</strong> ${trail.surface}</p>
            ${trail.description ? `<p><strong>Details:</strong> ${trail.description}</p>` : ''}
        `;
        trailsList.appendChild(trailItem);
    });
}

// search function
const searchTrailsBtn = document.getElementById('search-trails-btn');
if (searchTrailsBtn) {
    searchTrailsBtn.addEventListener('click', async () => {
        const locationInput = document.getElementById('location-input').value.trim();
        const loadingDiv = document.getElementById('loading');
        const errorDiv = document.getElementById('error');
        const mapDiv = document.getElementById('map');
        const trailsList = document.getElementById('trails-list');

        if (!locationInput) {
            errorDiv.textContent = 'Please enter a location!';
            errorDiv.style.display = 'block';
            return;
        }

        // Hide previous results
        mapDiv.style.display = 'none';
        trailsList.style.display = 'none';
        errorDiv.style.display = 'none';
        loadingDiv.style.display = 'flex';

        try {
            // Geocode location
            const coords = await geocodeLocation(locationInput);
            
            // Initialize map
            initMap(coords.lat, coords.lon);

            // Find trails
            const trails = await findTrails(coords.lat, coords.lon);

            // Add markers and display list
            addTrailMarkers(trails);
            displayTrails(trails);

            loadingDiv.style.display = 'none';
        } catch (error) {
            loadingDiv.style.display = 'none';
            errorDiv.textContent = `Error: ${error.message}. Please try again!`;
            errorDiv.style.display = 'block';
        }
    });
}