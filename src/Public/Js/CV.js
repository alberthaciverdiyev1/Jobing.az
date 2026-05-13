var cvSummaryEditor = null;
var cvDynamicEditors = [];

document.addEventListener('DOMContentLoaded', () => {
    alertify.set('notifier', 'position', 'top-right');

    const isEdit = window.location.pathname.includes('/edit/');

    // Init CKEditor for cv-summary
    var summaryEl = document.getElementById('cv-summary');
    if (summaryEl && typeof ClassicEditor !== 'undefined') {
        ClassicEditor.create(summaryEl, {
            toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', '|', 'undo', 'redo']
        }).then(function(editor) {
            cvSummaryEditor = editor;
        }).catch(function(err) {
            console.error('CKEditor error:', err);
        });
    }

    // Init CKEditor for existing dynamic fields (edit mode)
    document.querySelectorAll('.edu-desc, .exp-desc').forEach(function(el) {
        initCVTextarea(el);
    });

    // ============================================
    // CV CREATE FORM
    // ============================================
    const cvForm = document.getElementById('cv-form');
    if (cvForm) {
        cvForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Sync all CKEditor instances back to textareas
            cvDynamicEditors.forEach(function(editor) {
                editor.updateElement();
            });

            // Collect skills
            const skills = [];
            document.querySelectorAll('#skills-container span').forEach(span => {
                const text = span.textContent.replace('×', '').trim();
                if (text) skills.push(text);
            });

            // Collect education
            const education = [];
            document.querySelectorAll('.education-item').forEach(item => {
                education.push({
                    school: item.querySelector('.edu-school')?.value || '',
                    degree: item.querySelector('.edu-degree')?.value || '',
                    field: item.querySelector('.edu-field')?.value || '',
                    startDate: item.querySelector('.edu-start')?.value || '',
                    endDate: item.querySelector('.edu-end')?.value || '',
                    description: item.querySelector('.edu-desc')?.value || ''
                });
            });

            // Collect experience
            const experience = [];
            document.querySelectorAll('.experience-item').forEach(item => {
                experience.push({
                    company: item.querySelector('.exp-company')?.value || '',
                    position: item.querySelector('.exp-position')?.value || '',
                    startDate: item.querySelector('.exp-start')?.value || '',
                    endDate: item.querySelector('.exp-end')?.value || '',
                    description: item.querySelector('.exp-desc')?.value || ''
                });
            });

            // Collect languages
            const languages = [];
            document.querySelectorAll('.language-item').forEach(item => {
                languages.push({
                    name: item.querySelector('.lang-name')?.value || '',
                    level: item.querySelector('.lang-level')?.value || 'intermediate'
                });
            });

            const data = {
                title: document.getElementById('cv-title').value.trim(),
                fullName: document.getElementById('cv-fullname')?.value.trim() || '',
                email: document.getElementById('cv-email')?.value.trim() || '',
                phone: document.getElementById('cv-phone')?.value.trim() || '',
                address: document.getElementById('cv-address')?.value.trim() || '',
                summary: cvSummaryEditor ? cvSummaryEditor.getData().trim() : document.getElementById('cv-summary')?.value.trim() || '',
                skills,
                education,
                experience,
                languages,
                linkedin: document.getElementById('cv-linkedin')?.value.trim() || '',
                website: document.getElementById('cv-website')?.value.trim() || ''
            };

            if (!data.title) {
                alertify.error('CV başlığı daxil edin');
                return;
            }

            try {
                let res;
                if (isEdit) {
                    const cvId = window.location.pathname.split('/edit/')[1];
                    res = await axios.put(`/api/cv/${cvId}`, data);
                } else {
                    res = await axios.post('/api/cv', data);
                }

                if (res.status === 201 || res.status === 200) {
                    alertify.success(res.data.message);
                    setTimeout(() => window.location.href = '/dashboard', 1000);
                }
            } catch (err) {
                alertify.error(err.response?.data?.error || 'Xəta baş verdi');
            }
        });
    }

    // ============================================
    // ADD EDUCATION
    // ============================================
    const addEducationBtn = document.getElementById('add-education');
    if (addEducationBtn) {
        addEducationBtn.addEventListener('click', () => {
            const list = document.getElementById('education-list');
            const div = document.createElement('div');
            div.className = 'education-item bg-gray-50 rounded-xl p-4 mb-3 relative';
            div.innerHTML = `
                <button type="button" class="remove-education absolute top-3 right-3 text-gray-400 hover:text-red-500"><i class="fas fa-times"></i></button>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><input type="text" class="edu-school w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm" placeholder="Məktəb / Universitet"></div>
                    <div><input type="text" class="edu-degree w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm" placeholder="Dərəcə (Bakalavr, Magistr)"></div>
                    <div><input type="text" class="edu-field w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm" placeholder="İxtisas"></div>
                    <div class="grid grid-cols-2 gap-2">
                        <input type="text" class="edu-start w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm" placeholder="Başlama">
                        <input type="text" class="edu-end w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm" placeholder="Bitmə">
                    </div>
                </div>
                <textarea class="edu-desc w-full mt-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm" rows="2" placeholder="Əlavə məlumat"></textarea>
            `;
            list.appendChild(div);
            var newEduDesc = div.querySelector('.edu-desc');
            if (newEduDesc) initCVTextarea(newEduDesc);
            addRemoveHandlers();
        });
    }

    // ============================================
    // ADD EXPERIENCE
    // ============================================
    const addExperienceBtn = document.getElementById('add-experience');
    if (addExperienceBtn) {
        addExperienceBtn.addEventListener('click', () => {
            const list = document.getElementById('experience-list');
            const div = document.createElement('div');
            div.className = 'experience-item bg-gray-50 rounded-xl p-4 mb-3 relative';
            div.innerHTML = `
                <button type="button" class="remove-experience absolute top-3 right-3 text-gray-400 hover:text-red-500"><i class="fas fa-times"></i></button>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><input type="text" class="exp-company w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm" placeholder="Şirkət"></div>
                    <div><input type="text" class="exp-position w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm" placeholder="Vəzifə"></div>
                    <div class="grid grid-cols-2 gap-2">
                        <input type="text" class="exp-start w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm" placeholder="Başlama">
                        <input type="text" class="exp-end w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm" placeholder="Bitmə">
                    </div>
                </div>
                <textarea class="exp-desc w-full mt-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm" rows="2" placeholder="Vəzifə öhdəlikləri"></textarea>
            `;
            list.appendChild(div);
            var newExpDesc = div.querySelector('.exp-desc');
            if (newExpDesc) initCVTextarea(newExpDesc);
            addRemoveHandlers();
        });
    }

    // ============================================
    // ADD LANGUAGE
    // ============================================
    const addLanguageBtn = document.getElementById('add-language');
    if (addLanguageBtn) {
        addLanguageBtn.addEventListener('click', () => {
            const list = document.getElementById('language-list');
            const div = document.createElement('div');
            div.className = 'language-item flex items-center gap-3 bg-gray-50 rounded-xl p-4 mb-3';
            div.innerHTML = `
                <button type="button" class="remove-language text-gray-400 hover:text-red-500"><i class="fas fa-times"></i></button>
                <input type="text" class="lang-name flex-1 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm" placeholder="Dil">
                <select class="lang-level px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm">
                    <option value="beginner">Başlanğıc</option>
                    <option value="intermediate" selected>Orta</option>
                    <option value="advanced">Qabaqcıl</option>
                    <option value="native">Ana dili</option>
                </select>
            `;
            list.appendChild(div);
            addRemoveHandlers();
        });
    }

    // ============================================
    // SKILLS
    // ============================================
    const addSkillBtn = document.getElementById('add-skill');
    const skillInput = document.getElementById('skill-input');

    function addSkill(name) {
        if (!name) return;
        const container = document.getElementById('skills-container');
        const span = document.createElement('span');
        span.className = 'inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium';
        span.innerHTML = `${name} <button type="button" class="remove-skill text-primary-400 hover:text-red-500">&times;</button>`;
        container.appendChild(span);
        span.querySelector('.remove-skill').addEventListener('click', () => span.remove());
    }

    if (addSkillBtn && skillInput) {
        addSkillBtn.addEventListener('click', () => {
            addSkill(skillInput.value.trim());
            skillInput.value = '';
        });
        skillInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkill(skillInput.value.trim());
                skillInput.value = '';
            }
        });
    }

    // Remove skill handler
    document.querySelectorAll('.remove-skill').forEach(btn => {
        btn.addEventListener('click', () => btn.closest('span').remove());
    });

    // ============================================
    // REMOVE ITEM HANDLERS
    // ============================================
    function addRemoveHandlers() {
        document.querySelectorAll('.remove-education').forEach(btn => {
            btn.addEventListener('click', () => btn.closest('.education-item').remove());
        });
        document.querySelectorAll('.remove-experience').forEach(btn => {
            btn.addEventListener('click', () => btn.closest('.experience-item').remove());
        });
        document.querySelectorAll('.remove-language').forEach(btn => {
            btn.addEventListener('click', () => btn.closest('.language-item').remove());
        });
    }

    addRemoveHandlers();

    // ============================================
    // CV UPLOAD FORM
    // ============================================
    const uploadForm = document.getElementById('cv-upload-form');
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('cv-file');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const uploadPreview = document.getElementById('upload-preview');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const changeFileBtn = document.getElementById('change-file');

    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('!border-primary-500', '!bg-primary-50/20');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('!border-primary-500', '!bg-primary-50/20');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('!border-primary-500', '!bg-primary-50/20');
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                handleFileSelect(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length) {
                handleFileSelect(fileInput.files[0]);
            }
        });

        if (changeFileBtn) {
            changeFileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                fileInput.click();
            });
        }
    }

    function handleFileSelect(file) {
        const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];
        const ext = '.' + file.name.split('.').pop().toLowerCase();

        if (!allowedTypes.includes(ext)) {
            alertify.error('Yalnız PDF, DOC, DOCX, TXT və RTF faylları yüklənə bilər');
            fileInput.value = '';
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alertify.error('Fayl ölçüsü 10MB-dan çox olmamalıdır');
            fileInput.value = '';
            return;
        }

        uploadPlaceholder.classList.add('hidden');
        uploadPreview.classList.remove('hidden');
        fileName.textContent = file.name;
        fileSize.textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB';
        dropZone.classList.add('!border-primary-500', '!bg-primary-50/10');
    }

    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const title = document.getElementById('upload-title').value.trim();
            const file = fileInput?.files?.[0];

            if (!title) {
                alertify.error('CV başlığı daxil edin');
                return;
            }

            if (!file) {
                alertify.error('CV faylı seçin');
                return;
            }

            const formData = new FormData();
            formData.append('title', title);
            formData.append('cvFile', file);

            try {
                const res = await axios.post('/api/cv/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (res.status === 201) {
                    alertify.success('CV uğurla yükləndi');
                    setTimeout(() => window.location.href = '/dashboard', 1000);
                }
            } catch (err) {
                alertify.error(err.response?.data?.error || 'Xəta baş verdi');
            }
        });
    }
});

function initCVTextarea(textarea) {
    if (!textarea || typeof ClassicEditor === 'undefined') return;
    ClassicEditor.create(textarea, {
        toolbar: ['bold', 'italic', 'link', 'bulletedList', '|', 'undo', 'redo']
    }).then(function(editor) {
        cvDynamicEditors.push(editor);
    }).catch(function(err) {
        console.error('CKEditor error:', err);
    });
}
