import { noDataCard } from './Helpers.js';

document.addEventListener('DOMContentLoaded', () => {
    alertify.set('notifier', 'position', 'top-right');

    getCategories();
    getCities();
    getEducation();
    getExperience();

    restoreFiltersFromURL();
    setupMobileFilterSheet();
    setupFilterEvents();
    setupLoadMore();
});

function createJobSeekerCard(el) {
    const title = capitalizeFirstLetter(el.title || '');
    const name = el.userName || '';
    const city = el.cityName || '';
    const postedDate = el.postedAt ? el.postedAt.slice(0, 10) : '';
    const education = el.education || '';
    const experience = el.experience || '';
    const detailLink = '/is-axtaran/' + (el.slug || el._id);

    const salary = el.salary || null;
    const salaryNegotiable = el.salaryNegotiable || false;
    let badgesHtml = '';
    if (education) {
        badgesHtml += `<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-600 rounded-full text-[11px] font-medium"><i class="fas fa-graduation-cap text-[10px]"></i> ${escapeHtml(education)}</span> `;
    }
    if (experience) {
        badgesHtml += `<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full text-[11px] font-medium"><i class="fas fa-briefcase text-[10px]"></i> ${escapeHtml(experience)}</span>`;
    }
    if (salaryNegotiable) {
        badgesHtml += `<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-600 rounded-full text-[11px] font-medium"><i class="fas fa-money-bill-wave text-[10px]"></i> Razılaşma ilə</span>`;
    } else if (salary) {
        badgesHtml += `<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-600 rounded-full text-[11px] font-medium"><i class="fas fa-money-bill-wave text-[10px]"></i> ${Number(salary).toLocaleString('az-AZ')} ₼</span>`;
    }

    return `<div class="job-card group bg-white rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1" style="border: 1px solid #d1d5db;" data-original-link="${detailLink}">
        <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-primary-600 font-bold text-lg flex-shrink-0 shadow-sm">
                ${(name || '?').charAt(0).toUpperCase()}
            </div>
            <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 text-base leading-snug line-clamp-2">${title}</h3>
                <p class="text-sm text-gray-500 mt-0.5 font-medium">${escapeHtml(name)}</p>
                <div class="flex items-center gap-4 mt-2 text-sm text-gray-400">
                    <span><i class="far fa-calendar mr-1.5"></i>${postedDate}</span>
                    ${city ? '<span><i class="fas fa-map-marker-alt mr-1.5"></i>' + escapeHtml(city) + '</span>' : ''}
                </div>
                ${badgesHtml ? '<div class="flex flex-wrap items-center gap-2 mt-3">' + badgesHtml + '</div>' : ''}
            </div>
        </div>
    </div>`;
}

function capitalizeFirstLetter(text) {
    if (!text) return '';
    return text.toLowerCase().split(' ').map(word => {
        if (!word) return '';
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============== FILTER DATA ==============

async function getCategories() {
    try {
        const { data } = await axios.get('/api/categories?website=BossAz');
        ['', 'mobile-'].forEach(prefix => {
            const select = document.getElementById(prefix + 'category-select-filter');
            if (!select) return;
            data.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat.localCategoryId || cat.categoryId || cat.id;
                opt.textContent = cat.categoryName || cat.name;
                select.appendChild(opt);
            });
        });
    } catch (e) { console.error(e); }
}

async function getCities() {
    try {
        const res = await axios.get('/api/cities?site=BossAz');
        let cities = res.data;
        if (!Array.isArray(cities) && typeof cities === 'object') cities = Object.values(cities);
        ['', 'mobile-'].forEach(prefix => {
            const select = document.getElementById(prefix + 'city-select-filter');
            if (!select) return;
            select.innerHTML = '<option value="">-- Seçin --</option>';
            (Array.isArray(cities) ? cities : []).forEach(city => {
                if (!city || typeof city !== 'object') return;
                const opt = document.createElement('option');
                opt.value = String(city.cityId ?? city._id ?? '');
                opt.textContent = String(city.name || '');
                select.appendChild(opt);
            });
        });
    } catch (e) { console.error('getCities error:', e); }
}

async function getEducation() {
    try {
        const { data } = await axios.get('/education');
        ['', 'mobile-'].forEach(prefix => {
            const select = document.getElementById(prefix + 'education-select');
            if (!select) return;
            Object.entries(data).forEach(([name, id]) => {
                const opt = document.createElement('option');
                opt.value = id;
                opt.textContent = name;
                select.appendChild(opt);
            });
        });
    } catch (e) { console.error(e); }
}

async function getExperience() {
    try {
        const { data } = await axios.get('/experience');
        ['', 'mobile-'].forEach(prefix => {
            const select = document.getElementById(prefix + 'experience-select');
            if (!select) return;
            Object.entries(data).forEach(([name, id]) => {
                const opt = document.createElement('option');
                opt.value = id;
                opt.textContent = name;
                select.appendChild(opt);
            });
        });
    } catch (e) { console.error(e); }
}

// ============== FILTER STATE ==============

let currentOffset = 0;
const LIMIT = 20;
let totalCount = 0;

function getFilterValues() {
    return {
        keyword: document.getElementById('search')?.value?.trim() || '',
        categoryId: document.getElementById('category-select-filter')?.value || '',
        cityId: document.getElementById('city-select-filter')?.value || '',
        educationId: document.getElementById('education-select')?.value || '',
        experienceId: document.getElementById('experience-select')?.value || '',
    };
}

function updateURLParams() {
    const f = getFilterValues();
    const params = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => { if (v) params.set(k, v); });
    history.replaceState(null, '', '/is-axtaran?' + params.toString());
}

function restoreFiltersFromURL() {
    const params = new URLSearchParams(location.search);
    [
        { key: 'keyword', id: 'search', mobileId: 'mobile-search' },
        { key: 'categoryId', id: 'category-select-filter', mobileId: 'mobile-category-select-filter' },
        { key: 'cityId', id: 'city-select-filter', mobileId: 'mobile-city-select-filter' },
        { key: 'educationId', id: 'education-select', mobileId: 'mobile-education-select' },
        { key: 'experienceId', id: 'experience-select', mobileId: 'mobile-experience-select' },
    ].forEach(({ key, id, mobileId }) => {
        const val = params.get(key) || '';
        const el = document.getElementById(id);
        if (el) el.value = val;
        const mel = document.getElementById(mobileId);
        if (mel) mel.value = val;
    });
    fetchJobSeekers();
}

// ============== MOBILE FILTER SHEET ==============

let isMobileOpen = false;

function setupMobileFilterSheet() {
    document.getElementById('mobileFilterBtn')?.addEventListener('click', openMobileFilterSheet);
    document.getElementById('mobileApplyFiltersBtn')?.addEventListener('click', () => {
        syncMobileToDesktop();
        currentOffset = 0;
        fetchJobSeekers();
        closeMobileFilterSheet();
    });
    document.getElementById('mobileClearFiltersBtn')?.addEventListener('click', () => {
        ['mobile-search', 'mobile-category-select-filter', 'mobile-city-select-filter', 'mobile-education-select', 'mobile-experience-select'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    });
}

function openMobileFilterSheet() {
    isMobileOpen = true;
    document.getElementById('mobileFilterSheet')?.classList.remove('hidden');
    setTimeout(() => {
        const panel = document.getElementById('mobileFilterPanel');
        if (panel) panel.classList.remove('translate-y-full');
        panel?.classList.add('translate-y-0');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closeMobileFilterSheet() {
    isMobileOpen = false;
    const panel = document.getElementById('mobileFilterPanel');
    if (panel) {
        panel.classList.remove('translate-y-0');
        panel.classList.add('translate-y-full');
    }
    setTimeout(() => {
        document.getElementById('mobileFilterSheet')?.classList.add('hidden');
    }, 300);
    document.body.style.overflow = '';
}

function syncMobileToDesktop() {
    [
        { mobile: 'mobile-search', desktop: 'search' },
        { mobile: 'mobile-category-select-filter', desktop: 'category-select-filter' },
        { mobile: 'mobile-city-select-filter', desktop: 'city-select-filter' },
        { mobile: 'mobile-education-select', desktop: 'education-select' },
        { mobile: 'mobile-experience-select', desktop: 'experience-select' },
    ].forEach(({ mobile, desktop }) => {
        const m = document.getElementById(mobile);
        const d = document.getElementById(desktop);
        if (m && d) d.value = m.value;
    });
}

// ============== MAIN FETCH ==============

function setupFilterEvents() {
    document.getElementById('applyFiltersBtn')?.addEventListener('click', () => {
        currentOffset = 0;
        updateURLParams();
        fetchJobSeekers();
    });
    document.getElementById('search')?.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            currentOffset = 0;
            updateURLParams();
            fetchJobSeekers();
        }
    });
}

function setupLoadMore() {
    document.getElementById('load-more-btn')?.addEventListener('click', () => {
        currentOffset += LIMIT;
        fetchJobSeekers(true);
    });
}

async function fetchJobSeekers(append = false) {
    const f = getFilterValues();
    const params = { ...f, offset: currentOffset, limit: LIMIT };
    Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });

    const container = document.getElementById('card-section');
    if (!append) {
        container.innerHTML = `<div class="col-span-full flex items-center justify-center py-16"><div class="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-3"></div><p class="text-gray-400 text-sm">Yüklənir...</p></div>`;
    }

    try {
        const { data } = await axios.get('/api/job-seekers', { params });
        const jobs = data.jobs || [];
        totalCount = data.totalCount || 0;

        document.getElementById('job-count').textContent = totalCount;

        if (jobs.length === 0 && !append) {
            container.innerHTML = noDataCard();
            document.getElementById('load-more-container').classList.add('hidden');
            return;
        }

        if (!append) container.innerHTML = '';
        jobs.forEach(el => {
            container.insertAdjacentHTML('beforeend', createJobSeekerCard(el));
        });

        // Click handlers
        container.querySelectorAll('.job-card').forEach(card => {
            card.addEventListener('click', function () {
                const link = this.dataset.originalLink;
                if (link) window.location.href = link;
            });
        });

        document.getElementById('load-more-container').classList[totalCount > currentOffset + LIMIT ? 'remove' : 'add']('hidden');
    } catch (err) {
        if (!append) container.innerHTML = noDataCard();
    }
}

window.openMobileFilterSheet = openMobileFilterSheet;
window.closeMobileFilterSheet = closeMobileFilterSheet;
window.fetchJobSeekers = fetchJobSeekers;
