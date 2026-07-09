document.addEventListener('DOMContentLoaded', async () => {
    const pathParts = window.location.pathname.split('/');
    const cvId = pathParts[pathParts.length - 1];

    const loadingEl = document.getElementById('cv-loading');
    const errorEl = document.getElementById('cv-error');
    const contentEl = document.getElementById('cv-content');

    try {
        const res = await axios.get('/api/public/cvs/' + cvId);
        const cv = res.data.cv;

        loadingEl.classList.add('hidden');
        contentEl.classList.remove('hidden');

        // Breadcrumb
        const name = cv.fullName || (cv.userId ? cv.userId.name + ' ' + cv.userId.surname : 'Adsız');
        document.getElementById('cv-name-breadcrumb').textContent = name;

        // Header
        document.getElementById('cv-fullname').textContent = name;
        if (cv.createdAt) {
            document.getElementById('cv-date').textContent = new Date(cv.createdAt).toLocaleDateString('az-AZ');
        }

        // Summary
        if (cv.summary) {
            document.getElementById('cv-summary-section').classList.remove('hidden');
            document.getElementById('cv-summary').textContent = cv.summary;
        }

        // Skills
        if (cv.skills && cv.skills.length > 0) {
            document.getElementById('cv-skills-section').classList.remove('hidden');
            document.getElementById('cv-skills').innerHTML = cv.skills.map(s =>
                `<span class="inline-flex px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-50 text-primary-700">${escapeHtml(s)}</span>`
            ).join('');
        }

        // Experience
        if (cv.experience && cv.experience.length > 0) {
            document.getElementById('cv-experience-section').classList.remove('hidden');
            document.getElementById('cv-experience').innerHTML = cv.experience.map(exp =>
                `<div class="relative pl-6 border-l-2 border-primary-100">
                    <div class="absolute left-0 top-1 w-3 h-3 -ml-[7px] rounded-full bg-primary-500 ring-2 ring-white"></div>
                    <div class="mb-1">
                        <p class="font-semibold text-gray-900">${escapeHtml(exp.position || '')}</p>
                        <p class="text-sm text-primary-500 font-medium">${escapeHtml(exp.company || '')}</p>
                    </div>
                    ${exp.startDate || exp.endDate ? `<p class="text-xs text-gray-400 mb-2">
                        <i class="far fa-calendar-alt mr-1"></i>${escapeHtml(exp.startDate || '')}${exp.startDate && exp.endDate ? ' — ' : ''}${escapeHtml(exp.endDate || '')}
                    </p>` : ''}
                    ${exp.description ? `<p class="text-sm text-gray-600 leading-relaxed">${escapeHtml(exp.description)}</p>` : ''}
                </div>`
            ).join('');
        }

        // Education
        if (cv.education && cv.education.length > 0) {
            document.getElementById('cv-education-section').classList.remove('hidden');
            document.getElementById('cv-education').innerHTML = cv.education.map(edu =>
                `<div class="relative pl-6 border-l-2 border-amber-100">
                    <div class="absolute left-0 top-1 w-3 h-3 -ml-[7px] rounded-full bg-amber-400 ring-2 ring-white"></div>
                    <div class="mb-1">
                        <p class="font-semibold text-gray-900">${escapeHtml(edu.school || '')}</p>
                        <p class="text-sm text-gray-500">${escapeHtml(edu.degree || '')}${edu.field ? ' — ' + escapeHtml(edu.field) : ''}</p>
                    </div>
                    ${edu.startDate || edu.endDate ? `<p class="text-xs text-gray-400">
                        <i class="far fa-calendar-alt mr-1"></i>${escapeHtml(edu.startDate || '')}${edu.startDate && edu.endDate ? ' — ' : ''}${escapeHtml(edu.endDate || '')}
                    </p>` : ''}
                    ${edu.description ? `<p class="text-sm text-gray-600 mt-1">${escapeHtml(edu.description)}</p>` : ''}
                </div>`
            ).join('');
        }

        // Languages
        if (cv.languages && cv.languages.length > 0) {
            document.getElementById('cv-languages-section').classList.remove('hidden');
            document.getElementById('cv-languages').innerHTML = cv.languages.map(lang =>
                `<div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100">
                    <span class="font-medium text-gray-900 text-sm">${escapeHtml(lang.name || '')}</span>
                    <span class="text-xs text-gray-400">${getLevelLabel(lang.level)}</span>
                </div>`
            ).join('');
        }

        // Uploaded File
        if (cv.type === 'uploaded' && cv.fileUrl) {
            document.getElementById('cv-file-section').classList.remove('hidden');
            const isPdf = cv.fileUrl.endsWith('.pdf');
            document.getElementById('cv-file').innerHTML = `
                <div class="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-100 flex-1 min-w-0">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 flex-shrink-0">
                        <i class="fas fa-${isPdf ? 'file-pdf' : 'file-word'} text-base sm:text-xl"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="font-medium text-gray-900 text-sm truncate">${escapeHtml(cv.fileName || 'CV')}</p>
                        <p class="text-xs text-gray-400">${isPdf ? 'PDF' : 'Word'} faylı</p>
                    </div>
                    <a href="${escapeHtml(cv.fileUrl)}" target="_blank" rel="noopener"
                       class="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-xs sm:text-sm font-medium transition-colors flex-shrink-0">
                        <i class="fas fa-download"></i>
                        Aç
                    </a>
                </div>`;
        }

        // Links
        const links = [];
        if (cv.linkedin) links.push({ icon: 'fab fa-linkedin', label: 'LinkedIn', url: cv.linkedin });
        if (cv.website) links.push({ icon: 'fas fa-globe', label: 'Veb sayt', url: cv.website });
        if (links.length > 0) {
            document.getElementById('cv-links-section').classList.remove('hidden');
            document.getElementById('cv-links').innerHTML = links.map(link =>
                `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-700 hover:text-primary-500 hover:border-primary-100 transition-colors">
                    <i class="${link.icon} text-primary-500"></i>
                    ${link.label}
                    <i class="fas fa-external-link-alt text-[10px] text-gray-400"></i>
                </a>`
            ).join('');
        }

    } catch {
        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');
    }
});

function getLevelLabel(level) {
    const labels = {
        'beginner': 'Başlanğıc',
        'intermediate': 'Orta',
        'advanced': 'Qabaqcıl',
        'native': 'Ana dili'
    };
    return labels[level] || level || '';
}

function escapeHtml(text) {
    if (!text) return '';
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}
