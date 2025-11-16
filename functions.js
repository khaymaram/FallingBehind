// navigate to walks screen when start button is clicked
const start = document.getElementById('start');
const popup = document.getElementById("WalkInfoPopup");
const openBtn = document.getElementById("AddWalk");
const closeBtn = document.getElementById("RecordWalk");

function navigateToWalkScreen() {
    window.location.href = 'walkscreen.html';
}

openBtn.addEventListener("click", () => {
  popup.style.display = "flex";  
});

closeBtn.addEventListener("click", () => {
  popup.style.display = "none"; 
});


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




