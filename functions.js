const WalkInfoPopup = document.getElementById("WalkInfoPopup");
const openBtn = document.getElementById("AddWalk");
const closeBtn = document.getElementById("RecordWalk");
const overlay = document.getElementById("WalkOverlay");

let username = "";
let goal = "";

// Save username
function setUsername() {
    const input = document.getElementById('enter-name').value;
    username = input;
    localStorage.setItem("username", username);
    updateName();
}

function setGoal() {
    const input = document.getElementById('enter-goal').value;
    goal = input;
    localStorage.setItem("goal", goal);
    updateProgressBar();  // Update progress bar instead of updateGoal
}

// Apply username to the profile page
function updateName() {
    const nameBox = document.getElementById('profile-name');
    if (nameBox) nameBox.innerText = username;
}

// Update progress bar with walking goal progress
function updateProgressBar() {
    const walks = JSON.parse(localStorage.getItem("walks")) || [];
    const totalMiles = walks.reduce((sum, walk) => sum + parseFloat(walk.distance || 0), 0);
    const goalMiles = parseFloat(localStorage.getItem("goal")) || 100;

    const percentage = Math.min(100, (totalMiles / goalMiles) * 100);
    const remaining = Math.max(0, goalMiles - totalMiles);

    const currentMilesEl = document.getElementById('current-miles');
    const goalMilesEl = document.getElementById('goal-miles');
    const remainingMilesEl = document.getElementById('remaining-miles');
    const fillElement = document.getElementById('progress-fill');
    const congratsElement = document.getElementById('congrats');

    if (currentMilesEl) currentMilesEl.textContent = totalMiles.toFixed(1);
    if (goalMilesEl) goalMilesEl.textContent = goalMiles;
    if (remainingMilesEl) remainingMilesEl.textContent = remaining.toFixed(1);

    if (fillElement) {
        fillElement.style.width = percentage + '%';
        fillElement.textContent = Math.round(percentage) + '%';
    }

    if (congratsElement && percentage >= 100) {
        congratsElement.classList.add('show');
    } else if (congratsElement) {
        congratsElement.classList.remove('show');
    }
    updateWalkStats();
    updateBadges();

}

// Update walk statistics
function updateWalkStats() {
    const walks = JSON.parse(localStorage.getItem("walks")) || [];

    // Count total walks
    const totalWalks = walks.length;

    // Calculate total time (assuming time is stored as "30 min" format)
    const totalMinutes = walks.reduce((sum, walk) => {
        const timeStr = walk.time || "0";
        const minutes = parseInt(timeStr.match(/\d+/)?.[0] || 0);
        return sum + minutes;
    }, 0);

    const totalWalksEl = document.getElementById('total-walks');
    const totalTimeEl = document.getElementById('total-time');

    if (totalWalksEl) totalWalksEl.textContent = totalWalks;
    if (totalTimeEl) totalTimeEl.textContent = totalMinutes;
}

// Edit goal functionality
function openEditGoalPopup() {
    const editGoalPopup = document.getElementById('edit-goal-popup');
    const newGoalInput = document.getElementById('new-goal');
    const currentGoal = localStorage.getItem("goal") || "100";

    if (newGoalInput) newGoalInput.value = currentGoal;
    if (editGoalPopup) editGoalPopup.style.display = "flex";
}

function closeEditGoalPopup() {
    const editGoalPopup = document.getElementById('edit-goal-popup');
    if (editGoalPopup) editGoalPopup.style.display = "none";
}

function saveNewGoal() {
    const newGoalInput = document.getElementById('new-goal');
    const newGoal = newGoalInput.value;

    if (newGoal && parseFloat(newGoal) > 0) {
        localStorage.setItem("goal", newGoal);
        goal = newGoal;
        updateProgressBar();
        closeEditGoalPopup();
    } else {
        alert("Please enter a valid goal!");
    }
}

// Badge milestones configuration
const BADGE_MILESTONES = [
    { type: 'miles', value: 10, image: "assets/badge-bg.svg", name: "First Steps" },
    { type: 'miles', value: 50, image: "assets/badge-bg.svg", name: "Half Century" },
    { type: 'miles', value: 100,  image: "assets/badge-bg.svg", name: "Century Club" },
    { type: 'walks', value: 10,  image: "assets/badge-bg.svg", name: "Novice Walker" },
    { type: 'walks', value: 30,  image: "assets/badge-bg.svg", name: "Super Walker" },
    { type: 'hours', value: 10,  image: "assets/badge-bg.svg", name: "Nonstop Walk" },
    { type: 'hours', value: 24,  image: "assets/badge-bg.svg", name: "Full Day" }
];

// Update badges based on total miles walked
function updateBadges() {
    const walks = JSON.parse(localStorage.getItem("walks")) || [];
    const totalMiles = walks.reduce((sum, walk) => sum + parseFloat(walk.distance || 0), 0);
    const totalWalks = walks.length;
    
    // Calculate total hours
    const totalMinutes = walks.reduce((sum, walk) => {
        const timeStr = walk.time || "0";
        const minutes = parseInt(timeStr.match(/\d+/)?.[0] || 0);
        return sum + minutes;
    }, 0);
    const totalHours = totalMinutes / 60;
    
    const badgeContainer = document.getElementById('badge-content');
    if (!badgeContainer) return;
    
    badgeContainer.innerHTML = '';
    
    BADGE_MILESTONES.forEach(milestone => {
        let earned = false;
        let displayValue = '';
        
        // Check if milestone is earned based on type
        if (milestone.type === 'miles') {
            earned = totalMiles >= milestone.value;
            displayValue = `${milestone.value} miles`;
        } else if (milestone.type === 'walks') {
            earned = totalWalks >= milestone.value;
            displayValue = `${milestone.value} walks`;
        } else if (milestone.type === 'hours') {
            earned = totalHours >= milestone.value;
            displayValue = `${milestone.value} hours`;
        }
        
        const badgeItem = document.createElement('div');
        badgeItem.classList.add('badge-item');
        
        const badgeIcon = document.createElement('div');
        badgeIcon.classList.add('badge-icon');
        badgeIcon.style.backgroundImage = `url('${milestone.image}')`;
        if (!earned) badgeIcon.classList.add('locked');
        
        const badgeLabel = document.createElement('div');
        badgeLabel.classList.add('badge-label');
        badgeLabel.textContent = milestone.name;
        
        const badgeMiles = document.createElement('div');
        badgeMiles.classList.add('badge-label');
        badgeMiles.style.fontSize = '10px';
        badgeMiles.style.opacity = '0.8';
        badgeMiles.textContent = displayValue;
        
        badgeItem.appendChild(badgeIcon);
        badgeItem.appendChild(badgeLabel);
        badgeItem.appendChild(badgeMiles);
        
        badgeContainer.appendChild(badgeItem);
    });
}
// PAGE NAVIGATION
function navigateToWalkScreen() {
    window.location.href = 'walkscreen.html';
}

function navigateToRecsScreen() {
    window.location.href = 'walkrecs.html';
}

function navigateToProfileScreen() {
    window.location.href = 'profile.html';
}

// creates walk object and adds it to the list of walks
function recordWalk() {
    const date = document.getElementById("walkDate").value;
    const time = document.getElementById("walkTime").value;
    const distance = document.getElementById("walkDistance").value;

    const walk = {
        date,
        time,
        distance
    };

    let walks = JSON.parse(localStorage.getItem("walks")) || [];
    walks.push(walk);
    localStorage.setItem("walks", JSON.stringify(walks));
}

function displayWalks() {
    const container = document.getElementById("walk-list");
    if (!container) return;

    container.innerHTML = "";
    let walks = JSON.parse(localStorage.getItem("walks")) || [];
    // list of xpositions as an attempt to look sporadic but still in a neat order
    const xPositions = ["81%", "10%", "46%", "63.5%", "28.5%", "73%", "20%", "55%", "36%"]
    walks.forEach((walk, i) => {
        const card = document.createElement("div");
        card.classList.add("walk-card");
        const patternIndex = i % xPositions.length;
        const x = xPositions[patternIndex];
        const y = patternIndex * 1 + Math.floor(i / 5) * 60+ (i * 40);      
        card.style.left = x;
        card.style.top = y + "px";
        card.innerHTML = `
            <div class="walk-text">
                <p>Date: ${walk.date}</p>
                <p>Time: ${walk.time}</p>
                <p>Distance: ${walk.distance}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// DOM READY - All event listeners that need DOM elements go here
document.addEventListener("DOMContentLoaded", () => {
    // GET POPUP ELEMENTS (after DOM is ready)
    const startPopup = document.getElementById("start-popup");
    const popupBtn = document.getElementById('popup-button');
    const startButton = document.getElementById("start");

    // START BUTTON - show popup
    if (startButton && startPopup) {
        startButton.addEventListener("click", () => {
            startPopup.style.display = "flex";
        });
    }

    // POPUP SUBMIT BUTTON - save and navigate
    if (popupBtn) {
        popupBtn.addEventListener('click', () => {
            setUsername();
            setGoal();
            navigateToWalkScreen();
        });
    }

    // ADD WALK BUTTON - show overlay
    if (openBtn && overlay) {
        openBtn.addEventListener("click", () => {
            overlay.style.display = "flex";
        });
    }

    // RECORD WALK BUTTON - close overlay and save walk
    if (closeBtn && overlay) {
        closeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            overlay.style.display = "none";
            recordWalk();
            displayWalks();
            updateProgressBar(); // Update progress bar after recording walk
        });
    }

    // NAV BUTTONS
    const mywalks = document.getElementById('mywalks-tab');
    const walkrecs = document.getElementById('walkrecs-tab');
    const profile = document.getElementById('profile-tab');

    if (mywalks) mywalks.addEventListener('click', navigateToWalkScreen);
    if (walkrecs) walkrecs.addEventListener('click', navigateToRecsScreen);
    if (profile) profile.addEventListener('click', navigateToProfileScreen);

    // LOAD NAME FROM STORAGE
    const storedName = localStorage.getItem("username");
    if (storedName) {
        username = storedName;
        updateName();
    }

    const storedGoal = localStorage.getItem("goal");
    if (storedGoal) {
        goal = storedGoal;
        updateProgressBar(); // Update progress bar on page load
    }

    // EDIT GOAL BUTTON
    const editGoalBtn = document.getElementById('edit-goal-btn');
    const saveGoalBtn = document.getElementById('save-goal-btn');
    const cancelGoalBtn = document.getElementById('cancel-goal-btn');

    if (editGoalBtn) {
        editGoalBtn.addEventListener('click', openEditGoalPopup);
    }

    if (saveGoalBtn) {
        saveGoalBtn.addEventListener('click', saveNewGoal);
    }

    if (cancelGoalBtn) {
        cancelGoalBtn.addEventListener('click', closeEditGoalPopup);
    }
});