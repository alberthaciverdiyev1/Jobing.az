document.addEventListener('DOMContentLoaded', () => {
    let currentPage = 1;

    const grid = document.getElementById('cv-grid');
    const searchInput = document.getElementById('cv-search');
    const pagination = document.getElementById('cv-pagination');

    async function loadCvs(page = 1, search = '') {
        grid.innerHTML = `<div class="col-span-full flex items-center justify-center py-20">
            <div class="flex flex-col items-center gap-3">
                <div class="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
                <span class="text-gray-400 text-sm">CV-lər yüklənir...</span>
            </div>
        </div>`;

        try {
            const res = await axios.get('/api/public/cvs', { params: { page, limit: 21, search } });
            const data = res.data;
            renderCvs(data.cvs || []);
            renderPagination(data.page, data.totalPages);
        } catch {
            grid.innerHTML = `<div class="col-span-full text-center py-20">
                <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <i class="fas fa-file-alt text-2xl text-gray-400"></i>
                </div>
                <p class="text-gray-500">CV-lər yüklənə bilmədi</p>
            </div>`;
        }
    }

    function renderCvs(cvs) {
        if (cvs.length === 0) {
            grid.innerHTML = `<div class="col-span-full text-center py-20">
                <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <i class="fas fa-file-alt text-2xl text-gray-400"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-1">CV tapılmadı</h3>
                <p class="text-sm text-gray-500">Hələ heç bir CV yüklənməyib</p>
            </div>`;
            return;
        }

        grid.innerHTML = cvs.map(cv => {
            const name = cv.fullName || (cv.userId ? cv.userId.name + ' ' + cv.userId.surname : 'Adsız');
            const skills = (cv.skills || []).slice(0, 4);
            const edu = cv.education && cv.education.length > 0 ? cv.education[0] : null;
            const date = cv.createdAt ? new Date(cv.createdAt).toLocaleDateString('az-AZ') : '';

            return `<div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                <div class="flex items-start gap-3 mb-3">
                    <div class="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 flex-shrink-0">
                        <i class="fas fa-user text-sm"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                        <h3 class="font-semibold text-gray-900 text-sm truncate group-hover:text-primary-500 transition-colors">${escapeHtml(name)}</h3>
                        <p class="text-xs text-gray-400">${date}</p>
                    </div>
                </div>

                <p class="text-xs text-gray-600 line-clamp-2 mb-3">${escapeHtml((cv.summary || '').slice(0, 120))}</p>

                ${skills.length > 0 ? `<div class="flex flex-wrap gap-1.5 mb-3">
                    ${skills.map(s => `<span class="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">${escapeHtml(s)}</span>`).join('')}
                    ${cv.skills.length > 4 ? `<span class="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-primary-50 text-primary-600">+${cv.skills.length - 4}</span>` : ''}
                </div>` : ''}

                ${edu ? `<div class="flex items-center gap-1.5 text-xs text-gray-400 pt-2 border-t border-gray-50">
                    <i class="fas fa-graduation-cap"></i>
                    <span>${escapeHtml(edu.school || '')}</span>
                </div>` : ''}
            </div>`;
        }).join('');
    }

    function renderPagination(page, totalPages) {
        if (!totalPages || totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        let html = '<div class="flex items-center gap-2">';
        if (page > 1) {
            html += `<button onclick="window.goToPage(${page - 1})" class="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"><i class="fas fa-chevron-left"></i></button>`;
        }
        for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
            html += `<button onclick="window.goToPage(${i})" class="px-3 py-2 rounded-lg text-sm font-medium transition-colors ${i === page ? 'bg-primary-500 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}">${i}</button>`;
        }
        if (page < totalPages) {
            html += `<button onclick="window.goToPage(${page + 1})" class="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"><i class="fas fa-chevron-right"></i></button>`;
        }
        html += '</div>';
        pagination.innerHTML = html;
    }

    window.goToPage = (p) => {
        currentPage = p;
        loadCvs(p, searchInput.value.trim());
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    let searchTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            currentPage = 1;
            loadCvs(1, searchInput.value.trim());
        }, 400);
    });

    loadCvs();

    function escapeHtml(text) {
        if (!text) return '';
        const d = document.createElement('div');
        d.textContent = text;
        return d.innerHTML;
    }
});
