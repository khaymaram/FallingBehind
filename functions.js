const WalkInfoPopup = document.getElementById("WalkInfoPopup");
const openBtn = document.getElementById("AddWalk");
const closeBtn = document.getElementById("RecordWalk");
const overlay = document.getElementById("WalkOverlay");

let username = "";
let goal = "";

// Save username
function setUsername(){
    const input = document.getElementById('enter-name').value;
    username = input;
    localStorage.setItem("username", username);
    updateName();  
}

function setGoal(){
    const input = document.getElementById('enter-goal').value;
    goal = input;
    localStorage.setItem("goal", goal);
    updateProgressBar();  // Update progress bar instead of updateGoal
}

// Apply username to the profile page
function updateName(){
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

    walks.forEach((walk) => {
        const card = document.createElement("div");
        card.classList.add("walk-card");

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