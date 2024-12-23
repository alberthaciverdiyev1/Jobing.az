document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([getCategories(), getCities(), getEducation(), getExperience()
    ]);
    alertify.set('notifier', 'position', 'top-right');
});
async function getCategories() {
    await axios.get('/api/categories', {
        params: { website: "BossAz" }
    }).then(res => {
        let h = '<option value="" disabled selected>Kategoriyanı seçin</option>';
        if (res.status === 200) {
            res.data.forEach(element => {
                h += ` <option value=${element.localCategoryId}>${element.categoryName}</option>`
                // categoryArray.push({
                //     "localCategoryId": element.localCategoryId,
                //     "name": element.categoryName
                // });
                document.getElementById("category").innerHTML = h;
            });
        }
    }).catch(error => {
        console.error("Error fetching categories:", error);
    });

}
async function getCities() {
    await axios.get('/api/cities', {
        params: { site: "BossAz" }
    })
        .then(res => {
            if (res.status === 200) {
                let h = '<option value="" disabled selected>Şəhəri seçin</option>';
                res.data.forEach(element => {
                    h += `<option value=${element.cityId}>${element.name}</option>`
                })
                document.getElementById("city").innerHTML = h;
            }
        })
        .catch(error => {
            console.error("Error fetching cities:", error);
        });

}

async function getEducation() {
    await axios.get('/education')
        .then(res => {
            let htmlContent = '<option value="" disabled selected>Təhsili seçin</option>';
            if (res.status === 200) {
                Object.entries(res.data).forEach((education) => {
                    htmlContent += `<option value=${education[1]}>${education[0]}</option>`;
                });
            }
            document.getElementById("education").innerHTML = htmlContent;
        })
        .catch(error => {
            console.error("Error fetching categories:", error);
        });

}


async function getExperience() {
    await axios.get('/experience')
        .then(res => {
            let htmlContent = '<option value="" disabled selected>Experience seçin</option>';
            if (res.status === 200) {
                Object.entries(res.data).forEach((experience) => {
                    htmlContent += `<option value=${experience[1]}>${experience[0]}</option>`;
                });
            }
            document.getElementById("experience").innerHTML = htmlContent;

        }).catch(error => {
            console.error("Error fetching experiences:", error);
        });

}

document.getElementById('addJob').addEventListener("click", async () => {
    const companyImageElement = document.getElementById("company-image");
    let companyImageBase64 = null;

    if (companyImageElement && companyImageElement.files && companyImageElement.files[0]) {
        companyImageBase64 = await fileToBase64(companyImageElement.files[0]);
    }

    const data = {
        email: document.getElementById("email")?.value.trim(),
        username: document.getElementById("username")?.value.trim(),
        phone: document.getElementById("phone")?.value.trim(),
        experience: document.getElementById("experience")?.value.trim(),
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
        if (key === "companyImage" || key === "minAge" || key === "maxSalary" || key === "minSalary") return;

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
        // alertify.success("Məlumat uğurla əlavə edildi!");
        axios.post('/api/jobs/add-request', { data: data }).then(res => {
            console.log(res);
            
            if (res.data.status === 200) {
                alertify.success(res.data.message);
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
                alertify.error(res.data.message);
            }
        });

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
