// ============================================
// COMPANY LIST
// ============================================
if (document.getElementById('company-grid')) {
    document.addEventListener('DOMContentLoaded', loadCompanies);
}

async function loadCompanies() {
    const grid = document.getElementById('company-grid');
    const searchInput = document.getElementById('company-search');

    async function fetchAndRender(search = '') {
        grid.innerHTML = `<div class="col-span-full flex items-center justify-center py-20">
            <div class="flex flex-col items-center gap-3">
                <div class="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
                <span class="text-gray-400 text-sm">Şirkətlər yüklənir...</span>
            </div>
        </div>`;

        try {
            const res = await axios.get('/api/public/companies');
            let companies = res.data;

            if (search) {
                const q = search.toLowerCase();
                companies = companies.filter(c => c.companyName.toLowerCase().includes(q));
            }

            if (companies.length === 0) {
                grid.innerHTML = `<div class="col-span-full text-center py-20">
                    <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-building text-2xl text-gray-400"></i>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-1">Şirkət tapılmadı</h3>
                    <p class="text-sm text-gray-500">Axtarışınıza uyğun şirkət yoxdur</p>
                </div>`;
                return;
            }

            grid.innerHTML = companies.map(c => {
                const logo = getCompanyLogo(c.imageUrl);
                return `<a href="/sirket/${c._id}" class="block bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm">
                            <img src="${logo}" alt="${escapeHtml(c.companyName)}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='/Images/DefaultCompany.png'">
                        </div>
                        <div class="min-w-0 flex-1">
                            <h3 class="font-semibold text-gray-900 group-hover:text-primary-500 transition-colors truncate">${escapeHtml(c.companyName)}</h3>
                            <p class="text-sm text-gray-400">${c.vacancyCount} vakansiya</p>
                        </div>
                        <i class="fas fa-chevron-right text-xs text-gray-300 group-hover:text-primary-400 transition-colors"></i>
                    </div>
                </a>`;
            }).join('');
        } catch {
            grid.innerHTML = `<div class="col-span-full text-center py-20">
                <p class="text-gray-500">Şirkətlər yüklənə bilmədi</p>
            </div>`;
        }
    }

    let searchTimer;
    searchInput?.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => fetchAndRender(searchInput.value.trim()), 400);
    });

    fetchAndRender();
}

// ============================================
// COMPANY DETAIL
// ============================================
if (document.getElementById('company-hero')) {
    document.addEventListener('DOMContentLoaded', loadCompanyDetail);
}

async function loadCompanyDetail() {
    const pathParts = window.location.pathname.split('/');
    const companyId = pathParts[pathParts.length - 1];

    try {
        const res = await axios.get('/api/public/companies/' + companyId);
        const data = res.data;
        const company = data.company;
        const jobs = data.jobs || [];

        // Hero
        const logo = getCompanyLogo(company.imageUrl);
        document.getElementById('company-logo').src = logo;
        document.getElementById('company-name').textContent = company.companyName || '';
        document.getElementById('company-name-breadcrumb').textContent = company.companyName || 'Şirkət';
        if (company.website) {
            document.getElementById('company-website').innerHTML = `<a href="${escapeHtml(company.website)}" target="_blank" class="hover:underline"><i class="fas fa-globe mr-1"></i>${escapeHtml(company.website)}</a>`;
        }
        document.getElementById('company-jobs-count').textContent = jobs.length + ' vakansiya';

        // Jobs
        const container = document.getElementById('company-jobs');
        if (jobs.length === 0) {
            container.innerHTML = '<div class="text-center py-12"><div class="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3"><i class="fas fa-briefcase text-gray-400"></i></div><p class="text-gray-500 text-sm">Bu şirkətin hələ aktiv vakansiyası yoxdur</p></div>';
            return;
        }

        container.innerHTML = '<div class="divide-y divide-gray-50">' + jobs.map(job => {
            const detailLink = (job.redirectUrl && job.redirectUrl !== '#')
                ? job.redirectUrl
                : `/vakansiyalar/${job.uniqueKey || job._id}/details`;
            const date = job.postedAt ? new Date(job.postedAt).toLocaleDateString('az-AZ') : '';

            return `<a href="${detailLink}" class="flex items-center justify-between p-5 sm:px-6 hover:bg-gray-50/50 transition-colors group">
                <div class="min-w-0 flex-1">
                    <p class="font-semibold text-gray-900 text-sm truncate group-hover:text-primary-500 transition-colors">${escapeHtml(job.title)}</p>
                    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 mt-1">
                        ${job.location ? `<span><i class="fas fa-map-marker-alt mr-1"></i>${escapeHtml(job.location)}</span>` : ''}
                        <span><i class="far fa-calendar mr-1"></i>${date}</span>
                    </div>
                </div>
                <div class="flex-shrink-0 ml-3">
                    ${job.minSalary || job.maxSalary
                        ? `<span class="text-sm font-semibold text-primary-500">${job.minSalary || ''}${job.minSalary && job.maxSalary ? ' - ' : ''}${job.maxSalary || ''} ₼</span>`
                        : '<span class="text-xs text-gray-400">Razılaşma</span>'}
                </div>
            </a>`;
        }).join('') + '</div>';

    } catch {
        document.getElementById('company-hero').innerHTML = '<div class="text-center py-16"><p class="text-gray-500">Şirkət tapılmadı</p><a href="/sirketler" class="text-primary-500 hover:underline text-sm mt-2 inline-block">Bütün şirkətlər</a></div>';
    }
}

// ============================================
// HELPERS
// ============================================
function getCompanyLogo(imageUrl) {
    if (!imageUrl) return '/Images/DefaultCompany.png';
    if (imageUrl.includes('src/Public')) {
        return imageUrl.slice(imageUrl.indexOf('src/Public') + 10);
    }
    if (imageUrl.startsWith('http')) return imageUrl;
    return imageUrl;
}

function escapeHtml(text) {
    if (!text) return '';
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}
