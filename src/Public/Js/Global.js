document.addEventListener("DOMContentLoaded", () => {
    // Mobile menu toggle
    const menuToggle = document.getElementById("menuToggle");
    const menuClose = document.getElementById("menuClose");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuBackdrop = document.getElementById("menuBackdrop");

    if (menuToggle && mobileMenu) {
        menuToggle.onclick = function () {
            mobileMenu.classList.toggle("open");
            if (menuBackdrop) menuBackdrop.classList.toggle("open");
        };
    }

    if (menuClose && mobileMenu) {
        menuClose.onclick = function () {
            mobileMenu.classList.remove("open");
            if (menuBackdrop) menuBackdrop.classList.remove("open");
        };
    }

    if (menuBackdrop && mobileMenu) {
        menuBackdrop.onclick = function () {
            mobileMenu.classList.remove("open");
            menuBackdrop.classList.remove("open");
        };
    }
});
