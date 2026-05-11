// ============================================
// COMPANY LIST - Load More Pagination
// ============================================
if (document.getElementById('company-grid')) {
    document.addEventListener('DOMContentLoaded', initCompanyList);
}

let companyPage = 1;
let companyIsLoading = false;
let companyHasMore = true;
let companySearch = '';
const COMPANY_LIMIT = 12;

function initCompanyList() {
    const grid = document.getElementById('company-grid');
    const searchInput = document.getElementById('company-search');

    // Add load more button after grid
    const loadMoreWrap = document.createElement('div');
    loadMoreWrap.id = 'load-more-wrap';
    loadMoreWrap.className = 'text-center mt-8 animate-fade-in-up';
    grid.parentNode.appendChild(loadMoreWrap);

    fetchCompanies(true);

    let searchTimer;
    searchInput?.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            companySearch = searchInput.value.trim();
            companyPage = 1;
            companyHasMore = true;
            grid.innerHTML = '';
            document.getElementById('load-more-wrap').innerHTML = '';
            fetchCompanies(true);
        }, 400);
    });
}

async function fetchCompanies(reset = false) {
    if (companyIsLoading || (!reset && !companyHasMore)) return;
    companyIsLoading = true;

    const grid = document.getElementById('company-grid');
    const loadMoreWrap = document.getElementById('load-more-wrap');

    if (reset) {
        grid.innerHTML = `<div class="col-span-full flex items-center justify-center py-20">
            <div class="flex flex-col items-center gap-3">
                <div class="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
                <span class="text-gray-400 text-sm">Şirkətlər yüklənir...</span>
            </div>
        </div>`;
        loadMoreWrap.innerHTML = '';
    } else {
        loadMoreWrap.innerHTML = `<div class="flex justify-center py-4">
            <div class="w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
        </div>`;
    }

    try {
        const res = await axios.get('/api/public/companies', {
            params: { page: companyPage, limit: COMPANY_LIMIT, search: companySearch }
        });
        const data = res.data;
        const companies = data.companies || [];
        companyHasMore = companyPage < data.totalPages;

        if (reset) {
            grid.innerHTML = '';
        }

        if (companies.length === 0 && companyPage === 1) {
            grid.innerHTML = `<div class="col-span-full text-center py-20">
                <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <i class="fas fa-building text-2xl text-gray-400"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-1">Şirkət tapılmadı</h3>
                <p class="text-sm text-gray-500">Axtarışınıza uyğun şirkət yoxdur</p>
            </div>`;
            loadMoreWrap.innerHTML = '';
            companyIsLoading = false;
            return;
        }

        // Append companies to grid
        companies.forEach(c => {
            const div = document.createElement('div');
            const logo = getCompanyLogo(c.imageUrl);
            div.innerHTML = `<a href="/sirket/${c._id}" class="block bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
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
            grid.appendChild(div.firstElementChild);
        });

        // Update load more button
        if (companyHasMore) {
            loadMoreWrap.innerHTML = `<button onclick="loadMoreCompanies()" class="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-primary-500 font-medium px-8 py-3 rounded-xl border-2 border-primary-200 hover:border-primary-300 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]">
                <i class="fas fa-chevron-down text-xs"></i>
                Daha Çox
            </button>`;
        } else {
            loadMoreWrap.innerHTML = '';
        }

    } catch {
        if (reset) {
            grid.innerHTML = `<div class="col-span-full text-center py-20">
                <p class="text-gray-500">Şirkətlər yüklənə bilmədi</p>
            </div>`;
        }
        loadMoreWrap.innerHTML = '';
    }

    companyIsLoading = false;
}

window.loadMoreCompanies = function() {
    companyPage++;
    fetchCompanies(false);
};

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
                : `/vakansiyalar/${job.slug || job.uniqueKey || job._id}/details`;
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
