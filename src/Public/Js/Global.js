document.addEventListener("DOMContentLoaded", (event) => {
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
    document.getElementsByClassName("fa-chevron-up").onclick = function () {
        this.item
    }
    document.getElementById("mobile-filter-btn").onclick = function () {
        document.getElementById("filter-section").classList.toggle("hidden");
        document.getElementById("card-section").classList.toggle("hidden");
    };
});