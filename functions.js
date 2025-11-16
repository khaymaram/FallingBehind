const start = document.getElementById('start');
const WalkInfoPopup = document.getElementById("WalkInfoPopup");
const openBtn = document.getElementById("AddWalk");
const closeBtn = document.getElementById("RecordWalk");
const startPopup = document.getElementById('start-popup');
const popupBtn = document.getElementById('popup-button');
const overlay = document.getElementById("WalkOverlay");
let username = "";

function setUsername(){
    const input = document.getElementById('enter-name').value;
    username = input;
    localStorage.setItem("username", username);
}

function updateName(){
    document.getElementById('profile-name').innerText = 
        `${username}`;
}

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

document.addEventListener("DOMContentLoaded", () => {
    const mywalks = document.getElementById('mywalks-tab');
    const walkrecs = document.getElementById('walkrecs-tab');
    const profile = document.getElementById('profile-tab');

    if (mywalks) mywalks.addEventListener('click', navigateToWalkScreen);
    if (walkrecs) walkrecs.addEventListener('click', navigateToRecsScreen);
    if (profile) profile.addEventListener('click', navigateToProfileScreen);

    const name = localStorage.getItem("username");
    if (name) {
        document.getElementById('profile-name').innerText = name;
    }
});

function openStartPopup(){
    startPopup.style.display = 'flex';
}

if (start) {
    start.addEventListener('click', openStartPopup);
}

function recordWalk() {
    const date = document.getElementById("walkData").value
    const time = document.getElementById("walkTime").value
    const distance = document.getElementById("walkDistance").value

    const walk = { /* walk object */
        date, 
        time, 
        distance
    };

    let walks = JSON.parse(localStorage.getItem("walks")) || [];
    walks.push(walk)
    localStorage.setItem("walks", JSON.stringify(walks))
}

function displayWalks() {
    const container = document.getElementById("walk-list"); // a div you'll create to hold walks
    container.innerHTML = ""; // clear current walks

    let walks = JSON.parse(localStorage.getItem("walks")) || [];

    walks.forEach((walk, index) => {
        const card = document.createElement("div");
        card.classList.add("walk-card");

        card.innerHTML = `
            <h3>Walk ${index + 1}</h3>
            <p>Date: ${walk.date}</p>
            <p>Time: ${walk.time}</p>
            <p>Distance: ${walk.distance}</p>
        `;

        container.appendChild(card);
    });
}