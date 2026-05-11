import { createJobCard, noDataCard } from './Helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([getCategories(), getCities(), getEducation(), getExperience()]);
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
        // Trigger reflow before adding translate class for animation
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
        // Hide overlay after transition
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 300);
    }

    openBtn?.addEventListener('click', openSheet);
    closeBtn?.addEventListener('click', closeSheet);
    backdrop?.addEventListener('click', closeSheet);

    // Mobile apply: trigger filter + close
    mobileApply?.addEventListener('click', () => {
        offset = 0;
        fetchJobs();
        closeSheet();
    });

    // Sync mobile clear with desktop clear
    document.getElementById('mobile-clear-filters')?.addEventListener('click', function () {
        clearAllFilters();
        offset = 0;
        fetchJobs();
        closeSheet();
    });
}

// ========== SHARED FILTER HELPERS ==========
function clearAllFilters() {
    document.getElementById('search').value = '';
    document.getElementById('category-select-filter').value = '';
    document.getElementById('city-select-filter').value = '';
    document.getElementById('education-select').value = '';
    document.getElementById('experience-select').value = '';
    offset = 0;
    allJobs = true;
    // Reset job type tabs
    document.querySelectorAll('.job-type-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-primary-500', 'text-white');
        btn.classList.add('bg-gray-100', 'text-gray-600');
    });
    const allBtn = document.querySelector('.job-type-btn[data-type="all"]');
    if (allBtn) {
        allBtn.classList.remove('bg-gray-100', 'text-gray-600');
        allBtn.classList.add('active', 'bg-primary-500', 'text-white');
    }
    updateActiveFilterCount();
}

function updateActiveFilterCount() {
    const count = [
        document.getElementById('search')?.value || '',
        document.getElementById('category-select-filter')?.value || '',
        document.getElementById('city-select-filter')?.value || '',
        document.getElementById('education-select')?.value || '',
        document.getElementById('experience-select')?.value || '',
    ].filter(v => v !== '').length;

    const badge = document.getElementById('active-filter-count');
    if (badge) {
        badge.textContent = count;
        badge.classList.toggle('hidden', count === 0);
    }
}

// ========== DESKTOP FILTER EVENTS ==========
// Advanced filter toggle
document.getElementById('toggleAdvanced')?.addEventListener('click', function () {
    const advanced = document.getElementById('advancedFilters');
    advanced?.classList.toggle('hidden');
    this.innerHTML = advanced?.classList.contains('hidden')
        ? '<i class="fas fa-plus-circle"></i> Ətraflı filtrlər'
        : '<i class="fas fa-minus-circle"></i> Daralt';
});

// Apply filters
document.getElementById('applyFiltersBtn')?.addEventListener('click', () => {
    offset = 0;
    fetchJobs();
});

// Clear filters
document.getElementById('clearFilters')?.addEventListener('click', function () {
    clearAllFilters();
    fetchJobs();
});

// Search on enter
document.getElementById('search')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        offset = 0;
        fetchJobs();
    }
});

// Job type tabs
document.querySelectorAll('.job-type-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.job-type-btn').forEach(b => {
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
            document.getElementById('category-select-filter').innerHTML = h;
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
            document.getElementById('city-select-filter').innerHTML = h;
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
            document.getElementById('education-select').innerHTML = h;
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
            document.getElementById('experience-select').innerHTML = h;
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
    if (keyword) document.getElementById('search').value = keyword;
    if (categoryId) document.getElementById('category-select-filter').value = categoryId;
    if (cityId) document.getElementById('city-select-filter').value = cityId;
    if (educationId) document.getElementById('education-select').value = educationId;
    if (experienceLevel) document.getElementById('experience-select').value = experienceLevel;
    updateActiveFilterCount();
    fetchJobs();
}

function getFilterValues() {
    return {
        categoryId: document.getElementById('category-select-filter')?.value || null,
        cityId: document.getElementById('city-select-filter')?.value || null,
        educationId: document.getElementById('education-select')?.value || null,
        experienceLevel: document.getElementById('experience-select')?.value || null,
        keyword: document.getElementById('search')?.value || '',
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
            res.data.jobs.forEach(el => { html += createJobCard(el, false); });

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
    section.innerHTML = `<div class="flex items-center justify-center min-h-[400px] bg-white rounded-2xl border border-gray-100 shadow-sm">
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
    return `<div class="flex items-center justify-center mt-6">
        <button class="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-xl border border-gray-200 transition-all shadow-sm hover:shadow-md active:scale-[0.98]" id="load-more-btn">
            Daha Çox <i class="fas fa-chevron-down text-xs"></i>
        </button>
    </div>`;
}

// Load more handler
document.addEventListener('click', function (e) {
    if (e.target.closest('#load-more-btn')) {
        const btn = e.target.closest('#load-more-btn');
        btn.remove();
        document.getElementById('card-section').insertAdjacentHTML('beforeend',
            `<div class="flex justify-center py-6" id="load-more-spinner">
                <div class="w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
            </div>`);
        offset += 100;
        fetchJobs();
    }
});
