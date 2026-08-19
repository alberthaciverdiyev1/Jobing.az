// ============================================
// COMPANY SETTINGS - Profile Management
// ============================================
(function() {
    const form = document.getElementById('companyProfileForm');
    if (!form) return;

    const alertContainer = document.getElementById('alertContainer');
    const alertMessage = document.getElementById('alertMessage');
    var descEditor = null;

    // Init CKEditor for description
    var descEl = document.getElementById('description');
    if (descEl && typeof ClassicEditor !== 'undefined') {
        ClassicEditor.create(descEl, {
            toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'undo', 'redo']
        }).then(function(editor) {
            descEditor = editor;
        }).catch(function(err) {
            console.error('CKEditor error:', err);
        });
    }

    function showAlert(message, type = 'success') {
        alertContainer.classList.remove('hidden');
        alertMessage.className = `px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-3 ${
            type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
        }`;
        alertMessage.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
        setTimeout(() => alertContainer.classList.add('hidden'), 5000);
    }

    // ============================================
    // SAVE PROFILE
    // ============================================
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i> Saxlanılır...';

        const data = {
            description: descEditor ? descEditor.getData().trim() : document.getElementById('description').value.trim(),
            industry: document.getElementById('industry').value,
            foundedYear: document.getElementById('foundedYear').value ? Number(document.getElementById('foundedYear').value) : null,
            employeeCount: document.getElementById('employeeCount').value,
            website: document.getElementById('website').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            address: document.getElementById('address').value.trim(),
            socialLinks: {
                facebook: document.getElementById('socialFacebook').value.trim(),
                instagram: document.getElementById('socialInstagram').value.trim(),
                twitter: document.getElementById('socialTwitter').value.trim()
            },
            workingHours: {}
        };

        document.querySelectorAll('.wh-input').forEach(inp => {
            data.workingHours[inp.dataset.day] = inp.value.trim();
        });

        try {
            const res = await axios.put('/api/company/profile', data);
            showAlert(res.data.message || 'Məlumatlar yeniləndi', 'success');
        } catch (err) {
            const msg = err.response?.data?.error || 'Xəta baş verdi';
            showAlert(msg, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHtml;
        }
    });

    // ============================================
    // LOGO UPLOAD
    // ============================================
    window.uploadLogo = function(input) {
        if (!input.files || !input.files[0]) return;
        const file = input.files[0];
        if (file.size > 5 * 1024 * 1024) {
            return showAlert('Fayl ölçüsü 5MB-dan çox olmamalıdır', 'error');
        }

        const formData = new FormData();
        formData.append('file', file);

        // Preview immediately
        const reader = new FileReader();
        reader.onload = (e) => {
            const logoImg = document.getElementById('logoImg');
            const logoPlaceholder = document.getElementById('logoPlaceholder');
            logoImg.src = e.target.result;
            logoImg.classList.remove('hidden');
            logoPlaceholder.classList.add('hidden');
        };
        reader.readAsDataURL(file);

        axios.post('/api/company/upload-logo', formData)
            .then(res => showAlert(res.data.message || 'Logo yeniləndi', 'success'))
            .catch(err => {
                const msg = err.response?.data?.error || 'Yükləmə xətası';
                showAlert(msg, 'error');
            });
    };

    // ============================================
    // BANNER UPLOAD
    // ============================================
    window.uploadBanner = function(input) {
        if (!input.files || !input.files[0]) return;
        const file = input.files[0];
        if (file.size > 5 * 1024 * 1024) {
            return showAlert('Fayl ölçüsü 5MB-dan çox olmamalıdır', 'error');
        }

        const formData = new FormData();
        formData.append('file', file);

        // Preview immediately
        const reader = new FileReader();
        reader.onload = (e) => {
            const bannerImg = document.getElementById('bannerImg');
            const bannerPlaceholder = document.getElementById('bannerPlaceholder');
            bannerImg.src = e.target.result;
            bannerImg.classList.remove('hidden');
            bannerPlaceholder.classList.add('hidden');
        };
        reader.readAsDataURL(file);

        axios.post('/api/company/upload-banner', formData)
            .then(res => showAlert(res.data.message || 'Banner yeniləndi', 'success'))
            .catch(err => {
                const msg = err.response?.data?.error || 'Yükləmə xətası';
                showAlert(msg, 'error');
            });
    };

    // ============================================
    // CLEAR WORKING HOUR
    // ============================================
    window.clearWorkingHour = function(day) {
        const inp = document.getElementById('wh_' + day);
        if (inp) inp.value = '';
    };

})();
