import { createJobCard, noDataCard } from './Helpers.js';
import { createCustomSelect } from './Components/CustomSelect.js';

document.addEventListener("DOMContentLoaded", async () => {

    // Init custom selects immediately (empty, will refresh after data loads)
    const citySelect = document.getElementById('city-select');
    const csCity = citySelect ? createCustomSelect(citySelect) : null;

    // ========== LOAD JOBS ==========
    async function getJobs() {
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
                        const originalLink = this.getAttribute('data-original-link');
                        if (originalLink) {
                            if (originalLink.startsWith('/')) {
                                window.location.href = originalLink;
                            } else {
                                window.open(originalLink, '_blank');
                            }
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
                        el.innerText = val;
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching statistics:", error);
        }
    }

    // ========== INIT ==========
    await Promise.all([getJobs(), getCategories(), getCities(), getStatistics()]);
});
