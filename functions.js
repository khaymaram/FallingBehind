// navigate to walks screen when start button is clicked
const start = document.getElementById('start');
const popup = document.getElementById('start-popup');
const popupBtn = document.getElementById('popup-button');
let username = "";

function setUsername(){
    const input = document.getElementById('enter-name').value;
    username = input;
    updateName();
}

function updateName(){
    document.getElementById('profile-name').innerText = 
        `${username}`;
}

function navigateToWalkScreen() {
    window.location.href = 'walkscreen.html';
}

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
});

function openStartPopup(){
    popup.style.display = 'flex';
}

if (start) {
    start.addEventListener('click', openStartPopup);
}

popupBtn.addEventListener('click', navigateToWalkScreen);







