document.addEventListener("DOMContentLoaded", (event) => {
    document.querySelectorAll('.desktop-menu a').forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });

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


document.getElementById("lightButton").onclick = function(event) {
    event.preventDefault(); // formun submit olmasının qarşısını alır
    const nav = document.getElementsByTagName("nav")[0];
    nav.style.backgroundColor = "black";

}


    // document.getElementById("language").addEventListener('change', function () {

    //     const selectedLanguage = this.value;
    //     axios.post('/set-lang', { language: selectedLanguage })
    //         .then(function (response) {
    //             console.log('Success:', response.data);
    //             location.reload();
    //         })
    //         .catch(function (error) {
    //             console.error('Error:', error);
    //         });
    // });

});