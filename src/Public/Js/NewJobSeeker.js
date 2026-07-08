let editorAboutJob = null;

document.addEventListener('DOMContentLoaded', () => {
    alertify.set('notifier', 'position', 'top-right');

    // Init CKEditor
    ClassicEditor.create(document.getElementById('aboutJob'), {
        toolbar: ['heading', 'bold', 'italic', 'link', 'bulletedList', 'undo', 'redo', 'indent', 'outdent'],
        heading: { options: [ { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' }, { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_h1' }, { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_h2' } ] }
    }).then(editor => {
        editorAboutJob = editor;
    }).catch(() => {});

    // Load selects
    getCategories();
    getCities();
    getEducation();
    getExperience();

    // Submit
    document.getElementById('addJobSeeker')?.addEventListener('click', handleSubmit);

    // CV file upload
    const dropZone = document.getElementById('drop-zone');
    const cvFile = document.getElementById('cvFile');
    if (dropZone && cvFile) {
        dropZone.addEventListener('click', () => cvFile.click());
        cvFile.addEventListener('change', handleCVFileSelect);
    }
    document.getElementById('cv-change-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        cvFile.value = '';
        cvFile.click();
    });

    // When a CV is selected from dropdown, clear file upload
    const selectedCV = document.getElementById('selectedCV');
    if (selectedCV) {
        selectedCV.addEventListener('change', () => {
            if (selectedCV.value) {
                cvFile.value = '';
                document.getElementById('cv-placeholder')?.classList.remove('hidden');
                document.getElementById('cv-preview')?.classList.add('hidden');
            }
        });
    }
});

function handleCVFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    const placeholder = document.getElementById('cv-placeholder');
    const preview = document.getElementById('cv-preview');
    const fileName = document.getElementById('cv-file-name');
    const fileSize = document.getElementById('cv-file-size');

    if (fileName) fileName.textContent = file.name;
    if (fileSize) fileSize.textContent = (file.size / 1024).toFixed(1) + ' KB';
    if (placeholder) placeholder.classList.add('hidden');
    if (preview) preview.classList.remove('hidden');
}

async function getCategories() {
    try {
        const { data } = await axios.get('/api/categories?website=BossAz');
        const select = document.getElementById('category');
        if (!select) return;
        data.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.localCategoryId || cat.categoryId || cat.id;
            opt.textContent = cat.categoryName || cat.name || cat.title;
            select.appendChild(opt);
        });
    } catch (e) { console.error('getCategories error:', e); }
}

async function getCities() {
    try {
        const res = await axios.get('/api/cities?site=BossAz');
        let cities = res.data;
        if (!Array.isArray(cities) && typeof cities === 'object') cities = Object.values(cities);
        const select = document.getElementById('city');
        if (!select) return;
        (Array.isArray(cities) ? cities : []).forEach(city => {
            if (!city || typeof city !== 'object') return;
            const opt = document.createElement('option');
            opt.value = String(city.cityId ?? city._id ?? '');
            opt.textContent = String(city.name || '');
            select.appendChild(opt);
        });
        // Pre-select city from user profile
        const userCity = document.getElementById('city')?.dataset?.userCity;
        if (userCity && select) select.value = userCity;
    } catch (e) { console.error('getCities error:', e); }
}

async function getEducation() {
    try {
        const { data } = await axios.get('/education');
        const select = document.getElementById('education');
        if (!select) return;
        Object.entries(data).forEach(([name, id]) => {
            const opt = document.createElement('option');
            opt.value = id;
            opt.textContent = name;
            select.appendChild(opt);
        });
    } catch (e) { console.error('getEducation error:', e); }
}

async function getExperience() {
    try {
        const { data } = await axios.get('/experience');
        const select = document.getElementById('experience');
        if (!select) return;
        Object.entries(data).forEach(([name, id]) => {
            const opt = document.createElement('option');
            opt.value = id;
            opt.textContent = name;
            select.appendChild(opt);
        });
    } catch (e) { console.error('getExperience error:', e); }
}

function clearFieldError(id) {
    const el = document.getElementById(id + '-error');
    if (el) el.classList.add('hidden');
    const input = document.getElementById(id);
    if (input) input.classList.remove('border-red-500', 'ring-red-500/20');
}

function showFieldError(id, msg) {
    const el = document.getElementById(id + '-error');
    if (el) {
        el.classList.remove('hidden');
        el.querySelector('.error-text').textContent = msg || window.validationMessages?.[id] || 'Bu xana doldurulmalıdır';
    }
    const input = document.getElementById(id);
    if (input) input.classList.add('border-red-500', 'ring-red-500/20');
}

function showFormError(msg) {
    const container = document.getElementById('form-error');
    const text = document.getElementById('form-error-text');
    if (container && text) {
        text.textContent = msg;
        container.classList.remove('hidden');
        window.scrollTo({ top: container.offsetTop - 100, behavior: 'smooth' });
    }
}

function hideFormError() {
    const container = document.getElementById('form-error');
    if (container) container.classList.add('hidden');
}

function validateForm(data) {
    let valid = true;
    ['position', 'username', 'category', 'city', 'aboutJob'].forEach(id => clearFieldError(id));

    if (!data.position || data.position.length < 3) {
        showFieldError('position');
        valid = false;
    }
    if (!data.username) {
        showFieldError('username');
        valid = false;
    }
    if (!data.email && !data.phone) {
        showFieldError(data.email ? 'phone' : 'email');
        valid = false;
    }
    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
        showFieldError('email', 'Düzgün email daxil edin');
        valid = false;
    }
    if (!data.category) {
        showFieldError('category');
        valid = false;
    }
    if (!data.city) {
        showFieldError('city');
        valid = false;
    }
    if (!data.aboutJob || data.aboutJob.replace(/<[^>]*>/g, '').trim().length < 10) {
        showFieldError('aboutJob');
        valid = false;
    }

    return valid;
}

async function handleSubmit() {
    hideFormError();

    let aboutJob = '';
    if (editorAboutJob) {
        aboutJob = editorAboutJob.getData();
    } else {
        aboutJob = document.getElementById('aboutJob').value;
    }

    const data = {
        position: document.getElementById('position').value.trim(),
        username: document.getElementById('username').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        category: document.getElementById('category').value,
        city: document.getElementById('city').value,
        education: document.getElementById('education').value,
        experience: document.getElementById('experience').value,
        aboutJob,
        salary: document.getElementById('salary').value.trim(),
        salaryNegotiable: document.getElementById('salaryNegotiable').checked
    };

    if (!validateForm(data)) {
        showFormError('Zəhmət olmasa qeyd olunan xanaları doldurun');
        return;
    }

    const btn = document.getElementById('addJobSeeker');
    const originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Göndərilir...';

    try {
        const formData = new FormData();
        formData.append('position', data.position);
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('category', data.category);
        formData.append('city', data.city);
        formData.append('education', data.education);
        formData.append('experience', data.experience);
        formData.append('aboutJob', data.aboutJob);
        if (data.salary) formData.append('salary', data.salary);
        formData.append('salaryNegotiable', data.salaryNegotiable);

        // Existing CV selection
        const selectedCV = document.getElementById('selectedCV');
        if (selectedCV && selectedCV.value) {
            formData.append('selectedCV', selectedCV.value);
        }

        // File upload (only if no existing CV selected)
        const cvFile = document.getElementById('cvFile');
        if (cvFile && cvFile.files[0] && (!selectedCV || !selectedCV.value)) {
            formData.append('cvFile', cvFile.files[0]);
        }

        const res = await axios.post('/api/job-seeker', formData);
        if (res.data.status === 200 || res.status === 200) {
            alertify.success('Məlumat uğurla əlavə edildi!');
            document.getElementById('position').value = '';
            document.getElementById('username').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('category').value = '';
            document.getElementById('city').value = '';
            document.getElementById('education').value = '';
            document.getElementById('experience').value = '';
            if (editorAboutJob) editorAboutJob.setData('');
        } else {
            alertify.error(res.data.error || 'Xəta baş verdi');
        }
    } catch (err) {
        if (err.response?.status === 429) {
            alertify.error('Çox sayda sorğu. Bir az sonra yenidən cəhd edin.');
        } else if (err.response?.status === 401) {
            alertify.error('Daxil olmaq tələb olunur');
        } else if (err.response?.status === 400 && err.response?.data?.error) {
            // Map server validation errors to fields
            const errorMap = {
                'Vəzifə': 'position',
                'Ad tələb': 'username',
                'Email və ya telefon': 'email',
                'Düzgün email': 'email',
                'Kateqoriya': 'category',
                'Şəhər': 'city',
                'haqqında': 'aboutJob'
            };
            const serverMsg = err.response.data.error;
            let mapped = false;
            for (const [key, fieldId] of Object.entries(errorMap)) {
                if (serverMsg.includes(key)) {
                    showFieldError(fieldId, serverMsg);
                    mapped = true;
                    break;
                }
            }
            if (!mapped) {
                showFormError(serverMsg);
            }
        } else {
            alertify.error(err.response?.data?.error || 'Xəta baş verdi');
        }
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
    }
}

window.getCategories = getCategories;
window.getCities = getCities;
window.getEducation = getEducation;
window.getExperience = getExperience;
window.validateForm = validateForm;
window.handleSubmit = handleSubmit;
