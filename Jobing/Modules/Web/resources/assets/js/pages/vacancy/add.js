document.addEventListener('DOMContentLoaded', async () => {
    console.log("aa");
    await Promise.all([getCategories(), getCities(), getEducation(), getExperience()
    ]);
    alertify.set('notifier', 'position', 'top-right');
});
let editorRequirements = null;
let editorAboutJob = null;
let allValid = true;
let data = {};

// ClassicEditor
//     .create(document.querySelector('#requirements'), {
//         toolbar: [
//             'heading',
//             'bold',
//             'italic',
//             'link',
//             'bulletedList',
//             'undo',
//             'redo',
//             'indent',
//             'outdent'
//         ],
//         ClassicEditor
//     }).then(editor => {
//         editorRequirements = editor;
//     })
//     .catch(error => {
//         console.error(error);
//     });
//
// ClassicEditor
//     .create(document.querySelector('#aboutJob'), {
//         toolbar: [
//             'heading',
//             'bold',
//             'italic',
//             'link',
//             'bulletedList',
//             'undo',
//             'redo',
//             'indent',
//             'outdent'
//         ],
//     }).then(editor => {
//         editorAboutJob = editor;
//     })
//     .catch(error => {
//         console.error(error);
//     });

async function getCategories() {
    await axios.get('/api/categories', {
        params: { website: "BossAz" }
    }).then(res => {
        let h = '<option value="" disabled selected>Kategoriyanı seçin</option>';
        if (res.status === 200) {
            res.data.forEach(element => {
                h += ` <option value=${element.local_category_id}>${element.category_name}</option>`
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
                    h += `<option value=${element.city_id}>${element.name}</option>`
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



async function validateData(data) {
    allValid = true;
    const validatedData = { ...data };

    // Salary validation
    if (validatedData.maxSalary < 0) validatedData.maxSalary = 0;
    if (validatedData.maxSalary > 5000) validatedData.maxSalary = 5000;
    if (validatedData.minSalary < 0 || validatedData.minSalary > 5000) validatedData.minSalary = 0;

    // Age validation
    validatedData.minAge = validatedData.minAge < 18 ? 18 : (validatedData.minAge > 65 ? 65 : validatedData.minAge);
    validatedData.maxAge = validatedData.maxAge > 65 ? 65 : validatedData.maxAge;
    if (validatedData.maxAge < 18) validatedData.maxAge = 18;

    // Swapping logic
    if (validatedData.minSalary > validatedData.maxSalary) {
        [validatedData.minSalary, validatedData.maxSalary] = [validatedData.maxSalary, validatedData.minSalary];
    }
    if (validatedData.minAge > validatedData.maxAge) {
        [validatedData.minAge, validatedData.maxAge] = [validatedData.maxAge, validatedData.minAge];
    }

    // DOM updates
    Object.keys(data).forEach((key) => {
        if (key === "companyImage" || key === "maxAge" || key === "maxSalary" || key === "minSalary") return;

        const element = document.getElementById(key);
        if (!element) return;
        if (key === "requirements" && !data[key]) document.getElementById("requirements-error").classList.remove("hidden");
        if (key === "aboutJob" && !data[key]) document.getElementById("about-error").classList.remove("hidden");

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
                if (key === "requirements") document.getElementById("requirements-error").classList.add("hidden");
                if (key === "aboutJob") document.getElementById("about-error").classList.add("hidden");

            }
            element.classList.remove("border-red-500");
        }
    });

    return { allValid, validatedData };
}

document.getElementById('addJob').addEventListener("click", async () => {
    try {
        const companyImageElement = document.getElementById("companyImage");
        let companyImageBase64 = null;

        if (companyImageElement?.files?.[0]) {
            companyImageBase64 = await fileToBase64(companyImageElement.files[0]);
        }
        const requirementsEditorData = editorRequirements ? await editorRequirements.getData() : '';
        const aboutJobEditorData = editorAboutJob ? await editorAboutJob.getData() : '';

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
            minSalary: Number(document.getElementById("minSalary")?.value) || 0,
            maxSalary: Number(document.getElementById("maxSalary")?.value) || 0,
            minAge: Number(document.getElementById("minAge")?.value) || 18,
            maxAge: Number(document.getElementById("maxAge")?.value) || 65,
            requirements: requirementsEditorData.trim(),
            aboutJob: aboutJobEditorData.trim(),
        };

        const { allValid, validatedData } = await validateData(data);

        if (allValid) {
            console.log(validatedData)
            const response = await axios.post('/api/jobs/add-request', { data: validatedData },{
                'Content-Type': 'application/json'
            });
            if (response.data.status === 200) {
                alertify.success(response.data.message);
                // Clear form
                Object.keys(data).forEach((key) => {
                    const element = document.getElementById(key);
                    if (element) element.value = '';
                });
                if (companyImageElement) companyImageElement.value = null;
                if (editorRequirements) editorRequirements.setData('');
                if (editorAboutJob) editorAboutJob.setData('');
            } else {
                alertify.error(response.data.message);
            }
        } else {
            alertify.error("Zəhmət olmasa bütün məcburi xanaları doldurun!");
        }
    } catch (error) {
        alertify.error("Xəta baş verdi, zəhmət olmasa yenidən cəhd edin.");
        console.error(error);
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
