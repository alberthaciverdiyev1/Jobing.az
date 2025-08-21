document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("lightButton").onclick = function() {
        const nav = document.getElementsByTagName("nav")[0]; // ilk <nav> elementi
        nav.style.backgroundColor = "black"; // fon rəngi
        nav.style.color = "white"; // mətn rəngi
    }
});
