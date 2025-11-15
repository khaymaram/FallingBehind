// navigate to walks screen when start button is clicked
const start = document.getElementById('start');
function nagivateToWalkScreen() {
    window.location.href = 'walkscreen.html';
}
start.addEventListener('click', nagivateToWalkScreen);