// navigate to walks screen when start button is clicked
const start = document.getElementById('start');


function navigateToWalkScreen() {
    window.location.href = 'walkscreen.html';
}
start.addEventListener('click', nagivateToWalkScreen);

function openPopup() {
    document.getElementById("WalkInfoPopup").style.display = "block";
}

function closePopup() {
    document.getElementById("WalkInfoPopup").style.display = "none";
}

function navigateToRecsScreen() {
    window.location.href = 'walkrecs.html';
}

function navigateToProfileScreen() {
    window.location.href = 'profile.html';
}

if (start) {
    start.addEventListener('click', navigateToWalkScreen);
}

document.addEventListener("DOMContentLoaded", () => {
    const mywalks = document.getElementById('mywalks-tab');
    const walkrecs = document.getElementById('walkrecs-tab');
    const profile = document.getElementById('profile-tab');

    mywalks.addEventListener('click', navigateToWalkScreen);
    walkrecs.addEventListener('click', navigateToRecsScreen);
    profile.addEventListener('click', navigateToProfileScreen);
});




