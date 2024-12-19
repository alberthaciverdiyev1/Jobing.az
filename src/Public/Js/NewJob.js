document.addEventListener("DOMContentLoaded", () => {
    alertify.set('notifier', 'position', 'top-right');

    document.getElementById('addJob').addEventListener("click", async () => {
        const companyImageElement = document.getElementById("company-image");
        let companyImageBase64 = null;

        if (companyImageElement.files && companyImageElement.files[0]) {
            companyImageBase64 = await fileToBase64(companyImageElement.files[0]);
        }

        let data = {
            email: document.getElementById("email").value.trim(),
            username: document.getElementById("username").value.trim(),
            phone1: document.getElementById("phone1").value.trim(),
            phone2: document.getElementById("phone2").value.trim(), 
            companyName: document.getElementById("company-name").value.trim(),
            companyImage: companyImageBase64,
            category: document.getElementById("category").value,
            city: document.getElementById("city").value,
            position: document.getElementById("position").value.trim(),
            education: document.getElementById("education").value,
            minSalary: document.getElementById("min-salary").value,
            maxSalary: document.getElementById("max-salary").value,
            minAge: document.getElementById("min-age").value,
            maxAge: document.getElementById("max-age").value,
            requirements: document.getElementById("requirements").value.trim(),
            aboutJob: document.getElementById("about-job").value.trim(),
        };

        let allValid = true;

        Object.keys(data).forEach((key) => {
            if (key === "phone2" || key === "companyImage") return;

            const inputElement = document.getElementById(key);
            if (inputElement) {
                const errorMessage = inputElement.nextElementSibling; // Hemen sonraki kardeş eleman
                if (!data[key] || data[key] === "" || data[key] === "disabled") {
                    if (errorMessage && errorMessage.classList.contains("error-message")) {
                        errorMessage.classList.remove("hidden");
                    }
                    allValid = false;
                } else {
                    if (errorMessage && errorMessage.classList.contains("error-message")) {
                        errorMessage.classList.add("hidden");
                    }
                }
            }
        });

        if (allValid) {
            alertify.success("Məlumat uğurla əlavə edildi!");
        } else {
            alertify.error("Zəhmət olmasa bütün məcburi xanaları doldurun!");
        }
    });

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    }
});
