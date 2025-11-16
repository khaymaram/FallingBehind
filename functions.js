const WalkInfoPopup = document.getElementById("WalkInfoPopup");
const openBtn = document.getElementById("AddWalk");
const closeBtn = document.getElementById("RecordWalk");
const overlay = document.getElementById("WalkOverlay");
const startPopup = document.getElementById("start-popup");
const popupBtn = document.getElementById('popup-button');

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
    updateName();  
}

// Apply username to the profile page
function updateName(){
    const nameBox = document.getElementById('profile-name');
    if (nameBox) nameBox.innerText = username;
}

function updateGoal(){
    const goalBox = document.getElementById('profile-goal');
    if (goalBox) goalBox.innerText = `Goal: ${goal} miles`;
}

// PAGE NAVIGATION
function navigateToWalkScreen() {
    window.location.href = 'walkscreen.html';
}

openBtn.addEventListener("click", () => {
    overlay.style.display = "flex";
});

closeBtn.addEventListener("click", (e) => {
    
    e.preventDefault();
    overlay.style.display = "none";
    recordWalk();
    displayWalks();
    
});

function navigateToRecsScreen() {
    window.location.href = 'walkrecs.html';
}

function navigateToProfileScreen() {
    window.location.href = 'profile.html';
}

// START-PAGE POPUP
if (document.getElementById("start")) {
    document.getElementById("start").addEventListener("click", () => {
        if (startPopup) startPopup.style.display = "flex";
    });
}

if (popupBtn) {
    popupBtn.addEventListener('click', () => {
        setUsername();     // Save name
        setGoal();
        navigateToWalkScreen();  // Move to next page
    });
}

// DOM READY
document.addEventListener("DOMContentLoaded", () => {
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
        updateGoal();
    }
});

// Function for external usage
function openStartPopup(){
    if (startPopup) startPopup.style.display = 'flex';
}

if (startPopup) {
    startPopup.addEventListener('click', openStartPopup);
}

function recordWalk() {
    const date = document.getElementById("walkDate").value
    const time = document.getElementById("walkTime").value
    const distance = document.getElementById("walkDistance").value

    const walk = { /* walk object */
        date, 
        time, 
        distance
    };
    localStorage.setItem("oof", 1)

    let walks = JSON.parse(localStorage.getItem("walks")) || [];
    walks.push(walk)
    localStorage.setItem("walks", JSON.stringify(walks))
}

function displayWalks() {
    const container = document.getElementById("walk-list"); // a div you'll create to hold walks
    container.innerHTML = ""; // clear current walks

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
