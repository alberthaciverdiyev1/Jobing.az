import { createJobCard, noDataCard } from './Helpers.js';
import { createCustomSelect } from './Components/CustomSelect.js';

// ========== ELEMENT HELPERS ==========
function filterEl(id) {
    const prefix = isMobileOpen() ? 'mobile-' : '';
    return document.getElementById(prefix + id);
}

function populateBoth(id) {
    return {
        desktop: document.getElementById(id),
        mobile: document.getElementById('mobile-' + id),
    };
}

function isMobileOpen() {
    const overlay = document.getElementById('mobile-filter-overlay');
    return overlay && !overlay.classList.contains('hidden');
}

document.addEventListener('DOMContentLoaded', async () => {
    // Init custom selects — desktop
    const csCategoryDesktop = createCustomSelect(document.getElementById('category-select-filter'));
    const csCityDesktop = createCustomSelect(document.getElementById('city-select-filter'));
    const csEducationDesktop = createCustomSelect(document.getElementById('education-select'));
    const csExperienceDesktop = createCustomSelect(document.getElementById('experience-select'));

    // Init custom selects — mobile
    const csCategoryMobile = createCustomSelect(document.getElementById('mobile-category-select-filter'));
    const csCityMobile = createCustomSelect(document.getElementById('mobile-city-select-filter'));
    const csEducationMobile = createCustomSelect(document.getElementById('mobile-education-select'));
    const csExperienceMobile = createCustomSelect(document.getElementById('mobile-experience-select'));

    const allCustomSelects = [csCategoryDesktop, csCityDesktop, csEducationDesktop, csExperienceDesktop,
                              csCategoryMobile, csCityMobile, csEducationMobile, csExperienceMobile].filter(Boolean);

    // Load filter data, then refresh all custom selects
    await Promise.all([getCategories(), getCities(), getEducation(), getExperience()]);
    allCustomSelects.forEach(cs => cs.refresh());

    restoreFilters();
    setupMobileFilterSheet();
});

let offset = 0,
    allJobs = true,
    loading = false;

// ========== MOBILE FILTER BOTTOM SHEET ==========
function setupMobileFilterSheet() {
    const overlay = document.getElementById('mobile-filter-overlay');
    const sheet = document.getElementById('mobile-filter-sheet');
    const openBtn = document.getElementById('mobile-filter-btn');
    const closeBtn = document.getElementById('mobile-filter-close');
    const backdrop = document.getElementById('mobile-filter-backdrop');
    const mobileApply = document.getElementById('mobile-apply-filters');

    if (!overlay || !sheet) return;

    function openSheet() {
        overlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            sheet.classList.remove('translate-y-full');
            sheet.classList.add('translate-y-0');
        });
        document.body.classList.add('overflow-hidden');
    }

    function closeSheet() {
        sheet.classList.remove('translate-y-0');
        sheet.classList.add('translate-y-full');
        document.body.classList.remove('overflow-hidden');
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 300);
    }

    openBtn?.addEventListener('click', openSheet);
    closeBtn?.addEventListener('click', closeSheet);
    backdrop?.addEventListener('click', closeSheet);

    mobileApply?.addEventListener('click', () => {
        offset = 0;
        fetchJobs();
        closeSheet();
    });

    document.getElementById('mobile-clear-filters')?.addEventListener('click', function () {
        clearAllFilters();
        offset = 0;
        fetchJobs();
        closeSheet();
    });
}

// ========== SHARED FILTER HELPERS ==========
function clearAllFilters() {
    const s = filterEl('search');
    if (s) s.value = '';
    const cat = filterEl('category-select-filter');
    if (cat) cat.value = '';
    const city = filterEl('city-select-filter');
    if (city) city.value = '';
    const edu = filterEl('education-select');
    if (edu) edu.value = '';
    const exp = filterEl('experience-select');
    if (exp) exp.value = '';

    offset = 0;
    allJobs = true;

    const tabContainer = filterEl('job-type-tabs');
    if (tabContainer) {
        tabContainer.querySelectorAll('.job-type-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-primary-500', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-600');
        });
        const allBtn = tabContainer.querySelector('.job-type-btn[data-type="all"]');
        if (allBtn) {
            allBtn.classList.remove('bg-gray-100', 'text-gray-600');
            allBtn.classList.add('active', 'bg-primary-500', 'text-white');
        }
    }
    updateActiveFilterCount();
}

function updateActiveFilterCount() {
    const count = [
        filterEl('search')?.value || '',
        filterEl('category-select-filter')?.value || '',
        filterEl('city-select-filter')?.value || '',
        filterEl('education-select')?.value || '',
        filterEl('experience-select')?.value || '',
    ].filter(v => v !== '').length;

    const badge = document.getElementById('active-filter-count');
    if (badge) {
        badge.textContent = count;
        badge.classList.toggle('hidden', count === 0);
    }
}

// ========== DESKTOP FILTER EVENTS ==========
document.getElementById('applyFiltersBtn')?.addEventListener('click', () => {
    offset = 0;
    fetchJobs();
});

document.getElementById('clearFilters')?.addEventListener('click', function () {
    clearAllFilters();
    fetchJobs();
});

document.getElementById('search')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        offset = 0;
        fetchJobs();
    }
});

document.querySelectorAll('.job-type-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const container = this.closest('#job-type-tabs, #mobile-job-type-tabs');
        if (!container) return;
        container.querySelectorAll('.job-type-btn').forEach(b => {
            b.classList.remove('active', 'bg-primary-500', 'text-white');
            b.classList.add('bg-gray-100', 'text-gray-600');
        });
        this.classList.remove('bg-gray-100', 'text-gray-600');
        this.classList.add('active', 'bg-primary-500', 'text-white');
        allJobs = this.dataset.type === 'all';
        offset = 0;
        fetchJobs();
    });
});

// ========== DATA LOADING ==========
async function getCategories() {
    try {
        const res = await axios.get('/api/categories', { params: { website: "BossAz" } });
        if (res.status === 200) {
            let h = '<option value="">Bütün Kateqoriyalar</option>';
            res.data.forEach(el => {
                h += `<option value="${el.localCategoryId}">${el.categoryName}</option>`;
            });
            // Populate both desktop and mobile
            const { desktop, mobile } = populateBoth('category-select-filter');
            if (desktop) desktop.innerHTML = h;
            if (mobile) mobile.innerHTML = h;
            updateActiveFilterCount();
        }
    } catch (err) { console.error(err); }
}

async function getCities() {
    try {
        const res = await axios.get('/api/cities', { params: { site: "BossAz" } });
        if (res.status === 200) {
            let h = '<option value="">Bütün Şəhərlər</option>';
            res.data.forEach(el => {
                h += `<option value="${el.cityId}">${el.name}</option>`;
            });
            const { desktop, mobile } = populateBoth('city-select-filter');
            if (desktop) desktop.innerHTML = h;
            if (mobile) mobile.innerHTML = h;
        }
    } catch (err) { console.error(err); }
}

async function getEducation() {
    try {
        const res = await axios.get('/education');
        if (res.status === 200) {
            let h = '<option value="">Bütün təhsil səviyyələri</option>';
            Object.entries(res.data).forEach(([name, id]) => {
                h += `<option value="${id}">${name}</option>`;
            });
            const { desktop, mobile } = populateBoth('education-select');
            if (desktop) desktop.innerHTML = h;
            if (mobile) mobile.innerHTML = h;
        }
    } catch (err) { console.error(err); }
}

async function getExperience() {
    try {
        const res = await axios.get('/experience');
        if (res.status === 200) {
            let h = '<option value="">Bütün təcrübə səviyyələri</option>';
            Object.entries(res.data).forEach(([name, id]) => {
                h += `<option value="${id}">${name}</option>`;
            });
            const { desktop, mobile } = populateBoth('experience-select');
            if (desktop) desktop.innerHTML = h;
            if (mobile) mobile.innerHTML = h;
        }
    } catch (err) { console.error(err); }
}

// ========== URL PARAMS ==========
function getURLParams() {
    const p = new URLSearchParams(window.location.search);
    return {
        categoryId: p.get('categoryId') || '',
        cityId: p.get('cityId') || '',
        educationId: p.get('educationId') || '',
        experienceLevel: p.get('experienceLevel') || '',
        keyword: p.get('keyword') || '',
    };
}

function updateURLParams(params) {
    const current = new URLSearchParams(window.location.search);
    Object.entries(params).forEach(([k, v]) => {
        if (v) current.set(k, v);
        else current.delete(k);
    });
    window.history.replaceState({}, '', '?' + current.toString());
}

function restoreFilters() {
    const { categoryId, cityId, educationId, experienceLevel, keyword } = getURLParams();
    const sEl = filterEl('search');
    if (keyword && sEl) sEl.value = keyword;
    const cEl = filterEl('category-select-filter');
    if (categoryId && cEl) cEl.value = categoryId;
    const ciEl = filterEl('city-select-filter');
    if (cityId && ciEl) ciEl.value = cityId;
    const eEl = filterEl('education-select');
    if (educationId && eEl) eEl.value = educationId;
    const xEl = filterEl('experience-select');
    if (experienceLevel && xEl) xEl.value = experienceLevel;
    updateActiveFilterCount();
    fetchJobs();
}

function getFilterValues() {
    return {
        categoryId: filterEl('category-select-filter')?.value || null,
        cityId: filterEl('city-select-filter')?.value || null,
        educationId: filterEl('education-select')?.value || null,
        experienceLevel: filterEl('experience-select')?.value || null,
        keyword: filterEl('search')?.value || '',
    };
}

// ========== FETCH JOBS ==========
async function fetchJobs() {
    const filters = getFilterValues();
    const params = {
        ...filters,
        offset,
        allJobs,
        minSalary: 0,
        maxSalary: 5000,
    };

    updateURLParams(filters);
    updateActiveFilterCount();

    if (!offset) showLoader();

    try {
        const res = await axios.get('/api/jobs', { params });
        let html = '';

        if (res.status === 200 && res.data.totalCount) {
            res.data.jobs.forEach(el => { html += createJobCard(el, true); });

            const countEl = document.getElementById('job-count');
            if (countEl) countEl.textContent = res.data.totalCount;

            if (offset && res.data.jobs.length > 0) {
                document.getElementById('card-section').insertAdjacentHTML('beforeend',
                    html + (res.data.totalCount > 100 ? loadMoreBtn() : ''));
            } else {
                document.getElementById('card-section').innerHTML = html +
                    (res.data.totalCount > 100 ? loadMoreBtn() : '');
            }
        } else {
            document.getElementById('card-section').innerHTML = noDataCard();
            const countEl = document.getElementById('job-count');
            if (countEl) countEl.textContent = '0';
        }

        document.querySelectorAll('.job-card').forEach(card => {
            card.addEventListener('click', function () {
                const link = this.getAttribute('data-original-link');
                if (link) {
                    if (link.startsWith('/')) {
                        window.location.href = link;
                    } else {
                        window.open(link, '_blank');
                    }
                }
            });
        });
    } catch (err) {
        console.error(err);
        document.getElementById('card-section').innerHTML = noDataCard();
    } finally {
        hideLoader();
    }
}

function showLoader() {
    const section = document.getElementById('card-section');
    if (!section) return;
    section.innerHTML = `<div class="col-span-full flex items-center justify-center min-h-[400px] bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div class="flex flex-col items-center gap-3">
            <div class="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
            <span class="text-gray-400 text-sm">Yüklənir...</span>
        </div>
    </div>`;
}

function hideLoader() {
    const spinner = document.querySelector('#load-more-spinner');
    if (spinner) spinner.remove();
}

function loadMoreBtn() {
    return `<div class="col-span-full flex items-center justify-center mt-6">
        <button class="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-xl border border-gray-200 transition-all shadow-sm hover:shadow-md active:scale-[0.98]" id="load-more-btn">
            Daha Çox <i class="fas fa-chevron-down text-xs"></i>
        </button>
    </div>`;
}

document.addEventListener('click', function (e) {
    if (e.target.closest('#load-more-btn')) {
        const btn = e.target.closest('#load-more-btn');
        btn.remove();
        document.getElementById('card-section').insertAdjacentHTML('beforeend',
            `<div class="col-span-full flex justify-center py-6" id="load-more-spinner">
                <div class="w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
            </div>`);
        offset += 100;
        fetchJobs();
    }
});
