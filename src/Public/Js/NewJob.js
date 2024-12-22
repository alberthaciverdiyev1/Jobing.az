document.addEventListener("DOMContentLoaded", () => {
    alertify.set('notifier', 'position', 'top-right');

    document.getElementById('addJob').addEventListener("click", async () => {
        const companyImageElement = document.getElementById("company-image");
        let companyImageBase64 = null;

        if (companyImageElement && companyImageElement.files && companyImageElement.files[0]) {
            companyImageBase64 = await fileToBase64(companyImageElement.files[0]);
        }

        const data = {
            email: document.getElementById("email")?.value.trim(),
            username: document.getElementById("username")?.value.trim(),
            phone1: document.getElementById("phone1")?.value.trim(),
            phone2: document.getElementById("phone2")?.value.trim(),
            companyName: document.getElementById("companyName")?.value.trim(),
            companyImage: companyImageBase64,
            category: document.getElementById("category")?.value,
            city: document.getElementById("city")?.value,
            position: document.getElementById("position")?.value.trim(),
            education: document.getElementById("education")?.value,
            minSalary: document.getElementById("minSalary")?.value,
            maxSalary: document.getElementById("maxSalary")?.value,
            minAge: document.getElementById("minAge")?.value,
            maxAge: document.getElementById("maxAge")?.value,
            requirements: document.getElementById("requirements")?.value.trim(),
            aboutJob: document.getElementById("aboutJob")?.value.trim(),
        };

        let allValid = true;

        Object.keys(data).forEach((key) => {
            if (key === "phone2" || key === "companyImage" || key === "minAge" || key === "maxSalary" || key === "minSalary") return;

            const element = document.getElementById(key);
            if (!element) return;

            const errorMessage = element.closest("div").querySelector("span");

            if (!data[key]) {
                if (errorMessage) {
                    errorMessage.classList.remove("hidden");
                }
                element.classList.add("border-red-500");
                allValid = false;
            } else {
                if (errorMessage) {
                    errorMessage.classList.add("hidden");
                }
                element.classList.remove("border-red-500");
            }
        });

        if (allValid) {
            alertify.success("Məlumat uğurla əlavə edildi!");

            Object.keys(data).forEach((key) => {
                const element = document.getElementById(key);
                if (element) {
                    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                        element.value = "";
                    } else if (element.tagName === "SELECT") {
                        element.selectedIndex = 0;
                    }
                }
            });

            if (companyImageElement) {
                companyImageElement.value = null;
            }
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
