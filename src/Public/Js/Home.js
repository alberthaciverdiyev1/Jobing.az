import { createJobCard, noDataCard } from './Helpers.js';
import { createCustomSelect } from './Components/CustomSelect.js';

document.addEventListener("DOMContentLoaded", async () => {

    // Init custom selects immediately (empty, will refresh after data loads)
    const citySelect = document.getElementById('city-select');
    const csCity = citySelect ? createCustomSelect(citySelect) : null;

    // ========== JOB CARD NAVIGATION ==========
    function navigateToJob(card) {
        const originalLink = card.getAttribute('data-original-link');
        if (originalLink) {
            if (originalLink.startsWith('/')) {
                window.location.href = originalLink;
            } else {
                window.open(originalLink, '_blank');
            }
        }
    }

    // ========== LOAD JOBS ==========
    async function getJobs() {
        // Skip if SSR already rendered job cards
        if (document.querySelectorAll('#home-card-section .job-card').length > 0) return;
        try {
            const res = await axios.get('/api/jobs', {
                params: { allJobs: true }
            });

            if (res.status === 200 && res.data.totalCount) {
                const data = res.data.jobs.slice(0, 12);
                const htmlContent = data.map(el => createJobCard(el, true)).join('');
                document.getElementById("home-card-section").innerHTML = htmlContent;

                document.querySelectorAll('.job-card').forEach(card => {
                    card.addEventListener('click', function () {
                        navigateToJob(this);
                    });
                    card.addEventListener('keydown', function (e) {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            navigateToJob(this);
                        }
                    });
                });
            } else {
                document.getElementById("home-card-section").innerHTML = noDataCard();
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
            document.getElementById("home-card-section").innerHTML = noDataCard();
        }
    }

    // ========== LOAD CATEGORIES ==========
    async function getCategories() {
        try {
            const res = await axios.get('/api/categories', {
                params: { site: "bossAz" }
            });
            if (res.status === 200) {
                const select = document.getElementById("category-select");
                if (!select) return;
                let html = '<option value="">Bütün Kateqoriyalar</option>';
                Object.values(res.data).forEach(element => {
                    html += `<option value="${element.localCategoryId}">${element.categoryName}</option>`;
                });
                select.innerHTML = html;
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    // ========== LOAD CITIES ==========
    async function getCities() {
        try {
            const res = await axios.get('/api/cities', {
                params: { site: "BossAz" }
            });
            if (res.status === 200) {
                const select = document.getElementById("city-select");
                if (!select) return;
                let html = '<option value="">Bütün Şəhərlər</option>';
                res.data.forEach(element => {
                    html += `<option value="${element.cityId}">${element.name}</option>`;
                });
                select.innerHTML = html;
                // Refresh custom select with loaded options
                if (csCity) csCity.refresh();
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    }

    // ========== ANIMATE STATS COUNTER ==========
    function animateCounter(el, target, duration = 600) {
        const start = parseInt(el.innerText.replace(/[,\s]/g, '')) || 0;
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.innerText = Math.floor(start + (target - start) * eased);
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.innerText = target;
            }
        }
        requestAnimationFrame(update);
    }

    // ========== LOAD STATISTICS ==========
    async function getStatistics() {
        try {
            const res = await axios.get('/statistics');
            if (res.status === 200) {
                const stats = ['vacancy', 'company', 'visitor', 'totalVisitor'];
                stats.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        const val = res.data.data[id] || 0;
                        animateCounter(el, val);
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching statistics:", error);
        }
    }

    // ========== SEARCH LOADING STATE ==========
    const searchForm = document.getElementById('home-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function () {
            const btn = document.getElementById('home-search-btn');
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i> ' + btn.textContent.trim();
            }
        });
    }

    // ========== INIT ==========
    await Promise.all([getJobs(), getCategories(), getCities(), getStatistics()]);

    // Attach click/keyboard listeners to SSR-rendered job cards
    document.querySelectorAll('#home-card-section .job-card').forEach(card => {
        card.addEventListener('click', function () { navigateToJob(this); });
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigateToJob(this);
            }
        });
    });
});
