document.getElementById("menuToggle").onclick = function () {
    document.getElementById("mobile-menu").classList.toggle("open");
    document.getElementById("menuBackdrop").classList.toggle("open");
};

document.getElementById("menuClose").onclick = function () {
    document.getElementById("mobile-menu").classList.remove("open");
    document.getElementById("menuBackdrop").classList.remove("open");
};

document.getElementById("menuBackdrop").onclick = function () {
    document.getElementById("mobile-menu").classList.remove("open");
    document.getElementById("menuBackdrop").classList.remove("open");
};