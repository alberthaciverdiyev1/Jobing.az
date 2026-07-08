document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([getCategories(), getCities(), getEducation(), getExperience()]);
    alertify.set('notifier', 'position', 'top-right');
    setupFileUpload();
    setupSalaryNegotiation();
});
let editorRequirements = null;
let editorAboutJob = null;
let allValid = true;

ClassicEditor
    .create(document.querySelector('#requirements'), {
        toolbar: ['heading', 'bold', 'italic', 'link', 'bulletedList', 'undo', 'redo', 'indent', 'outdent'],
    }).then(editor => { editorRequirements = editor; })
    .catch(error => { console.error(error); });

ClassicEditor
    .create(document.querySelector('#aboutJob'), {
        toolbar: ['heading', 'bold', 'italic', 'link', 'bulletedList', 'undo', 'redo', 'indent', 'outdent'],
    }).then(editor => { editorAboutJob = editor; })
    .catch(error => { console.error(error); });

function setupFileUpload() {
    const fileInput = document.getElementById('companyImage');
    const fileLabel = fileInput?.previousElementSibling;
    if (!fileInput || !fileLabel) return;

    fileInput.addEventListener('change', function () {
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

function setupSalaryNegotiation() {
    const checkbox = document.getElementById('salaryNegotiable');
    const minInput = document.getElementById('minSalary');
    const maxInput = document.getElementById('maxSalary');
    if (!checkbox) return;

    checkbox.addEventListener('change', function () {
        const disabled = this.checked;
        minInput.disabled = disabled;
        maxInput.disabled = disabled;
        if (disabled) {
            minInput.classList.add('opacity-50', 'cursor-not-allowed', 'bg-gray-100');
            maxInput.classList.add('opacity-50', 'cursor-not-allowed', 'bg-gray-100');
            minInput.value = '';
            maxInput.value = '';
            clearFieldError('minSalary');
            clearFieldError('maxSalary');
            document.getElementById('salary-error')?.classList.add('hidden');
        } else {
            minInput.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-gray-100');
            maxInput.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-gray-100');
        }
    });
}

function showFieldError(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.classList.add('border-red-500', '!border-red-500');

    const errorSpan = document.getElementById(inputId + '-error');
    if (errorSpan) {
        errorSpan.querySelector('.error-text') && (errorSpan.querySelector('.error-text').textContent = message);
        errorSpan.classList.remove('hidden');
    }

    // Also handle CKEditor wrappers
    if (inputId === 'requirements' || inputId === 'aboutJob') {
        document.querySelector('.form-control-wrapper:has(#' + inputId + ')')?.classList.add('!border-red-500');
    }
}

function clearFieldError(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.classList.remove('border-red-500', '!border-red-500');

    const errorSpan = document.getElementById(inputId + '-error');
    if (errorSpan) {
        errorSpan.querySelector('.error-text') && (errorSpan.querySelector('.error-text').textContent = '');
        errorSpan.classList.add('hidden');
    }

    if (inputId === 'requirements' || inputId === 'aboutJob') {
        document.querySelector('.form-control-wrapper:has(#' + inputId + ')')?.classList.remove('!border-red-500');
    }
}

function clearAllErrors() {
    const errorFields = ['email', 'companyName', 'position', 'category', 'city', 'education',
        'experience', 'username', 'phone', 'minSalary', 'maxSalary', 'minAge', 'maxAge',
        'requirements', 'aboutJob'];
    errorFields.forEach(f => clearFieldError(f));
    document.getElementById('salary-error')?.classList.add('hidden');
    document.getElementById('form-error')?.classList.add('hidden');
}

async function getCategories() {
    try {
        const res = await axios.get('/api/categories', { params: { website: "BossAz" } });
        if (res.status === 200 && res.data) {
            let h = '<option value="" disabled selected>Kategoriyanı seçin</option>';
            res.data.forEach(element => {
                h += `<option value="${element.localCategoryId}">${element.categoryName}</option>`;
            });
            document.getElementById("category").innerHTML = h;
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

async function getCities() {
    try {
        const res = await axios.get('/api/cities', { params: { site: "BossAz" } });
        if (res.status === 200 && res.data) {
            let h = '<option value="" disabled selected>Şəhəri seçin</option>';
            res.data.forEach(element => {
                h += `<option value="${element.cityId}">${element.name}</option>`;
            });
            document.getElementById("city").innerHTML = h;
        }
    } catch (error) {
        console.error("Error fetching cities:", error);
    }
}

async function getEducation() {
    try {
        const res = await axios.get('/education');
        if (res.status === 200 && res.data) {
            let htmlContent = '<option value="" disabled selected>Təhsili seçin</option>';
            Object.entries(res.data).forEach(([name, id]) => {
                htmlContent += `<option value="${id}">${name}</option>`;
            });
            document.getElementById("education").innerHTML = htmlContent;
        }
    } catch (error) {
        console.error("Error fetching education:", error);
    }
}

async function getExperience() {
    try {
        const res = await axios.get('/experience');
        if (res.status === 200 && res.data) {
            let htmlContent = '<option value="" disabled selected>Təcrübə səviyyəsini seçin</option>';
            Object.entries(res.data).forEach(([name, id]) => {
                htmlContent += `<option value="${id}">${name}</option>`;
            });
            document.getElementById("experience").innerHTML = htmlContent;
        }
    } catch (error) {
        console.error("Error fetching experiences:", error);
    }
}

async function validateForm(data) {
    allValid = true;
    clearAllErrors();

    // --- EMAIL ---
    if (!data.email) {
        showFieldError('email', validationMessages.email_required);
        allValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
        showFieldError('email', validationMessages.email_invalid);
        allValid = false;
    }

    // --- COMPANY NAME ---
    if (!data.companyName) {
        showFieldError('companyName', validationMessages.companyName_required);
        allValid = false;
    } else if (data.companyName.length < 2) {
        showFieldError('companyName', validationMessages.companyName_minlength);
        allValid = false;
    }

    // --- POSITION ---
    if (!data.position) {
        showFieldError('position', validationMessages.position_required);
        allValid = false;
    } else if (data.position.length < 3) {
        showFieldError('position', validationMessages.position_minlength);
        allValid = false;
    }

    // --- CATEGORY ---
    if (!data.category || data.category === '') {
        showFieldError('category', validationMessages.category_required);
        allValid = false;
    }

    // --- CITY ---
    if (!data.city || data.city === '') {
        showFieldError('city', validationMessages.city_required);
        allValid = false;
    }

    // --- EDUCATION ---
    if (!data.education || data.education === '') {
        showFieldError('education', validationMessages.education_required);
        allValid = false;
    }

    // --- EXPERIENCE ---
    if (!data.experience || data.experience === '') {
        showFieldError('experience', validationMessages.experience_required);
        allValid = false;
    }

    // --- USERNAME ---
    if (!data.username) {
        showFieldError('username', validationMessages.username_required);
        allValid = false;
    }

    // --- PHONE ---
    if (!data.phone) {
        showFieldError('phone', validationMessages.phone_required);
        allValid = false;
    } else if (data.phone.length < 7) {
        showFieldError('phone', validationMessages.phone_minlength);
        allValid = false;
    }

    // --- SALARY (only if not negotiable) ---
    const isNegotiable = document.getElementById('salaryNegotiable')?.checked;
    if (!isNegotiable) {
        if (!data.minSalary && !data.maxSalary) {
            const salaryError = document.getElementById('salary-error');
            if (salaryError) {
                salaryError.querySelector('.error-text') && (salaryError.querySelector('.error-text').textContent = validationMessages.salary_required);
                salaryError.classList.remove('hidden');
            }
            document.getElementById('minSalary')?.classList.add('border-red-500', '!border-red-500');
            document.getElementById('maxSalary')?.classList.add('border-red-500', '!border-red-500');
            allValid = false;
        } else {
            if (data.minSalary && data.maxSalary && Number(data.minSalary) > Number(data.maxSalary)) {
                showFieldError('minSalary', validationMessages.salary_invalid_range);
                showFieldError('maxSalary', validationMessages.salary_invalid_range);
                allValid = false;
            }
            if (data.minSalary && (Number(data.minSalary) < 0 || Number(data.minSalary) > 50000)) {
                showFieldError('minSalary', validationMessages.salary_min_outofrange);
                allValid = false;
            }
            if (data.maxSalary && (Number(data.maxSalary) < 0 || Number(data.maxSalary) > 50000)) {
                showFieldError('maxSalary', validationMessages.salary_max_outofrange);
                allValid = false;
            }
        }
    }

    // --- AGE ---
    if (data.minAge && (Number(data.minAge) < 16 || Number(data.minAge) > 80)) {
        showFieldError('minAge', validationMessages.age_min_outofrange);
        allValid = false;
    }
    if (data.maxAge && (Number(data.maxAge) < 16 || Number(data.maxAge) > 80)) {
        showFieldError('maxAge', validationMessages.age_max_outofrange);
        allValid = false;
    }
    if (data.minAge && data.maxAge && Number(data.minAge) > Number(data.maxAge)) {
        showFieldError('minAge', validationMessages.age_invalid_range);
        showFieldError('maxAge', validationMessages.age_invalid_range);
        allValid = false;
    }

    // --- REQUIREMENTS (CKEditor) ---
    const reqText = data.requirements ? data.requirements.replace(/<[^>]*>/g, '').trim() : '';
    if (!reqText) {
        showFieldError('requirements', validationMessages.requirements_required);
        allValid = false;
    } else if (reqText.length < 10) {
        showFieldError('requirements', validationMessages.requirements_minlength);
        allValid = false;
    }

    // --- ABOUT JOB (CKEditor) ---
    const aboutText = data.aboutJob ? data.aboutJob.replace(/<[^>]*>/g, '').trim() : '';
    if (!aboutText) {
        showFieldError('aboutJob', validationMessages.aboutJob_required);
        allValid = false;
    } else if (aboutText.length < 10) {
        showFieldError('aboutJob', validationMessages.aboutJob_minlength);
        allValid = false;
    }

    return allValid;
}

document.getElementById('addJob').addEventListener("click", async () => {
    const submitBtn = document.getElementById('addJob');
    const originalText = submitBtn.innerHTML;

    try {
        const companyImageElement = document.getElementById("companyImage");
        let companyImageBase64 = null;

        if (companyImageElement?.files?.[0]) {
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (companyImageElement.files[0].size > maxSize) {
                alertify.error(validationMessages.file_too_large);
                return;
            }
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(companyImageElement.files[0].type)) {
                alertify.error(validationMessages.file_type_invalid);
                return;
            }
            companyImageBase64 = await fileToBase64(companyImageElement.files[0]);
        }

        const requirementsEditorData = editorRequirements ? await editorRequirements.getData() : '';
        const aboutJobEditorData = editorAboutJob ? await editorAboutJob.getData() : '';

        const isNegotiable = document.getElementById('salaryNegotiable')?.checked || false;

        const data = {
            email: document.getElementById("email")?.value.trim(),
            username: document.getElementById("username")?.value.trim(),
            phone: document.getElementById("phone")?.value.trim(),
            experience: document.getElementById("experience")?.value,
            companyName: document.getElementById("companyName")?.value.trim(),
            companyImage: companyImageBase64,
            category: document.getElementById("category")?.value,
            city: document.getElementById("city")?.value,
            position: document.getElementById("position")?.value.trim(),
            education: document.getElementById("education")?.value,
            minSalary: isNegotiable ? 0 : Number(document.getElementById("minSalary")?.value) || 0,
            maxSalary: isNegotiable ? 0 : Number(document.getElementById("maxSalary")?.value) || 0,
            minAge: Number(document.getElementById("minAge")?.value) || 0,
            maxAge: Number(document.getElementById("maxAge")?.value) || 0,
            requirements: requirementsEditorData.trim(),
            aboutJob: aboutJobEditorData.trim(),
            applicationMethod: document.querySelector('input[name="applicationMethod"]:checked')?.value || 'both',
            salaryNegotiable: isNegotiable,
        };

        const isValid = await validateForm(data);

        if (!isValid) {
            alertify.error(validationMessages.validation_error);
            document.querySelector('.bg-white.rounded-2xl')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + validationMessages.submitting;

        const response = await axios.post('/api/jobs/add-request', { data });

        if (response.data.status === 200) {
            alertify.success(response.data.message || validationMessages.success_message);
            // Clear form
            document.getElementById("email").value = '';
            document.getElementById("username").value = '';
            document.getElementById("phone").value = '';
            document.getElementById("companyName").value = '';
            document.getElementById("position").value = '';
            document.getElementById("category").selectedIndex = 0;
            document.getElementById("city").selectedIndex = 0;
            document.getElementById("education").selectedIndex = 0;
            document.getElementById("experience").selectedIndex = 0;
            document.getElementById("minSalary").value = '';
            document.getElementById("maxSalary").value = '';
            document.getElementById("minAge").value = '';
            document.getElementById("maxAge").value = '';
            if (companyImageElement) {
                companyImageElement.value = null;
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
            document.querySelector('input[name="applicationMethod"][value="both"]').checked = true;
            document.getElementById('salaryNegotiable').checked = false;
            document.getElementById('minSalary').disabled = false;
            document.getElementById('maxSalary').disabled = false;
            document.getElementById('minSalary').classList.remove('opacity-50', 'cursor-not-allowed', 'bg-gray-100');
            document.getElementById('maxSalary').classList.remove('opacity-50', 'cursor-not-allowed', 'bg-gray-100');
            clearAllErrors();
        } else {
            alertify.error(response.data.message || validationMessages.error_occurred);
        }
    } catch (error) {
        console.error(error);
        if (error.response) {
            const status = error.response.status;
            const msg = error.response.data?.error || error.response.data?.message;
            if (status === 429) {
                alertify.error(validationMessages.rate_limit);
            } else if (status === 401) {
                alertify.error(validationMessages.auth_required);
            } else if (status === 500) {
                alertify.error(validationMessages.server_error);
            } else {
                alertify.error(msg || validationMessages.error_generic);
            }
        } else if (error.request) {
            alertify.error(validationMessages.network_error);
        } else {
            alertify.error(validationMessages.unexpected_error);
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
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
