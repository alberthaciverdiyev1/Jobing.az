document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([getCategories(), getCities(), getEducation(), getExperience()]);
    alertify.set('notifier', 'position', 'top-right');
    setupFileUpload();
});
let editorRequirements = null;
let editorAboutJob = null;
let allValid = true;
let data = {};

ClassicEditor
    .create(document.querySelector('#requirements'), {
        toolbar: [
            'heading',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'undo',
            'redo',
            'indent',
            'outdent'
        ],
    }).then(editor => {
        editorRequirements = editor;
    })
    .catch(error => {
        console.error(error);
    });

ClassicEditor
    .create(document.querySelector('#aboutJob'), {
        toolbar: [
            'heading',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'undo',
            'redo',
            'indent',
            'outdent'
        ],
    }).then(editor => {
        editorAboutJob = editor;
    })
    .catch(error => {
        console.error(error);
    });

function setupFileUpload() {
    const fileInput = document.getElementById('companyImage');
    const fileLabel = fileInput?.previousElementSibling;
    if (!fileInput || !fileLabel) return;

    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const name = this.files[0].name;
            const textEl = fileLabel.querySelector('p:first-child');
            const subEl = fileLabel.querySelector('p:last-child');
            if (textEl) textEl.textContent = name;
            if (subEl) subEl.textContent = (this.files[0].size / 1024).toFixed(1) + ' KB';
            fileLabel.classList.add('!border-primary-500', '!bg-primary-50/30');
        }
    });
}

async function getCategories() {
    await axios.get('/api/categories', { params: { website: "BossAz" } })
        .then(res => {
            let h = '<option value="" disabled selected>Kategoriyanı seçin</option>';
            if (res.status === 200) {
                res.data.forEach(element => {
                    h += `<option value="${element.localCategoryId}">${element.categoryName}</option>`;
                });
                document.getElementById("category").innerHTML = h;
            }
        }).catch(error => {
            console.error("Error fetching categories:", error);
        });
}

async function getCities() {
    await axios.get('/api/cities', { params: { site: "BossAz" } })
        .then(res => {
            if (res.status === 200) {
                let h = '<option value="" disabled selected>Şəhəri seçin</option>';
                res.data.forEach(element => {
                    h += `<option value="${element.cityId}">${element.name}</option>`;
                });
                document.getElementById("city").innerHTML = h;
            }
        }).catch(error => {
            console.error("Error fetching cities:", error);
        });
}

async function getEducation() {
    await axios.get('/education')
        .then(res => {
            let htmlContent = '<option value="" disabled selected>Təhsili seçin</option>';
            if (res.status === 200) {
                Object.entries(res.data).forEach(([name, id]) => {
                    htmlContent += `<option value="${id}">${name}</option>`;
                });
            }
            document.getElementById("education").innerHTML = htmlContent;
        }).catch(error => {
            console.error("Error fetching education:", error);
        });
}

async function getExperience() {
    await axios.get('/experience')
        .then(res => {
            let htmlContent = '<option value="" disabled selected>Təcrübə səviyyəsini seçin</option>';
            if (res.status === 200) {
                Object.entries(res.data).forEach(([name, id]) => {
                    htmlContent += `<option value="${id}">${name}</option>`;
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

    // Swap if min > max
    if (validatedData.minSalary > validatedData.maxSalary) {
        [validatedData.minSalary, validatedData.maxSalary] = [validatedData.maxSalary, validatedData.minSalary];
    }
    if (validatedData.minAge > validatedData.maxAge) {
        [validatedData.minAge, validatedData.maxAge] = [validatedData.maxAge, validatedData.minAge];
    }

    // Validate required fields
    const requiredFields = ['email', 'username', 'phone', 'experience', 'companyName', 'category', 'city', 'position', 'education'];

    requiredFields.forEach(key => {
        const element = document.getElementById(key);
        if (!element) return;

        const errorSpan = element.closest('div')?.parentElement?.querySelector('.error-message') ||
                          element.parentElement?.parentElement?.querySelector('.error-message');

        if (!data[key]) {
            element.classList.add('border-red-500', '!border-red-500');
            if (errorSpan) errorSpan.classList.remove('hidden');
            allValid = false;
        } else {
            element.classList.remove('border-red-500', '!border-red-500');
            if (errorSpan) errorSpan.classList.add('hidden');
        }
    });

    // CKEditor fields
    if (!data.requirements) {
        document.getElementById('requirements-error')?.classList.remove('hidden');
        document.querySelector('.form-control-wrapper:has(#requirements)')?.classList.add('!border-red-500');
        allValid = false;
    } else {
        document.getElementById('requirements-error')?.classList.add('hidden');
        document.querySelector('.form-control-wrapper:has(#requirements)')?.classList.remove('!border-red-500');
    }

    if (!data.aboutJob) {
        document.getElementById('about-error')?.classList.remove('hidden');
        document.querySelector('.form-control-wrapper:has(#aboutJob)')?.classList.add('!border-red-500');
        allValid = false;
    } else {
        document.getElementById('about-error')?.classList.add('hidden');
        document.querySelector('.form-control-wrapper:has(#aboutJob)')?.classList.remove('!border-red-500');
    }

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
            const response = await axios.post('/api/jobs/add-request', { data: validatedData });
            if (response.data.status === 200) {
                alertify.success(response.data.message);
                // Clear form
                Object.keys(data).forEach((key) => {
                    const element = document.getElementById(key);
                    if (element) element.value = '';
                });
                if (companyImageElement) {
                    companyImageElement.value = null;
                    // Reset file upload label
                    const label = companyImageElement.previousElementSibling;
                    if (label) {
                        const textEl = label.querySelector('p:first-child');
                        const subEl = label.querySelector('p:last-child');
                        if (textEl) textEl.textContent = 'Şəkil seçin';
                        if (subEl) subEl.textContent = 'PNG, JPG max 5MB';
                        label.classList.remove('!border-primary-500', '!bg-primary-50/30');
                    }
                }
                if (editorRequirements) editorRequirements.setData('');
                if (editorAboutJob) editorAboutJob.setData('');
                // Clear validation states
                document.querySelectorAll('.border-red-500').forEach(el => {
                    el.classList.remove('border-red-500', '!border-red-500');
                });
                document.querySelectorAll('.error-message').forEach(el => {
                    el.classList.add('hidden');
                });
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
