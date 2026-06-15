//This script serves the purpose of making the theme switch button on the nav bar functional for the user to switch themes dynamically

let darkmode = localStorage.getItem('dark-mode');
const themeSwitch = document.querySelector('#theme-switch');

const enableDarkmode = () => {
    document.body.classList.add('dark-mode');
    localStorage.setItem('dark-mode', 'active');
}

const disableDarkmode = () => {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('dark-mode', null);
}

if(darkmode === "active") enableDarkmode();

themeSwitch.addEventListener("click", () => {
    if(darkmode !== "active") {
        darkmode = localStorage.getItem('dark-mode');
        enableDarkmode()
    }
    else {
        disableDarkmode()
    }
})