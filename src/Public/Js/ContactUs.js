document.addEventListener("DOMContentLoaded", (event) => {
    alertify.set('notifier', 'position', 'top-right');
    
    const sendMailButton = document.getElementById("send-mail");
    const buttonText = document.getElementById("button-text");
    const loader = document.getElementById("loader");

    sendMailButton.onclick = function () {
        let title = document.getElementById("title").value;
        let text = document.getElementById("text").value;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(title)) {
            alertify.error("Please enter a valid email address.");
            return;
        }

        let data = { title: title, text: text };

        // Show loader and disable button
        buttonText.classList.add("hidden");
        loader.classList.remove("hidden");
        sendMailButton.disabled = true;

        axios.post('/send-mail', { data: data }).then(res => {
            if (res.data.status === 200) {
                alertify.success(res.data.message);
                document.getElementById("title").value = "";
                document.getElementById("text").value = "";
            } else {
                alertify.error(res.data.message);
            }
        }).catch(error => {
            alertify.error("An error occurred. Please try again.");
        }).finally(() => {
            // Hide loader and re-enable button
            buttonText.classList.remove("hidden");
            loader.classList.add("hidden");
            sendMailButton.disabled = false;
        });
    };
});
