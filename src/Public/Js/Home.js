import { createJobCard, noDataCard } from './Helpers.js';

document.addEventListener("DOMContentLoaded", () => {

    async function getJobs() {
        await axios.get('/api/jobs', {
            params: { 'allJobs': true }
        }).then(res => {
            let htmlContent = '';

            if (res.status === 200) {
                if (res.data.totalCount) {
                    let data = res.data.jobs.slice(0, 12);
                    data.forEach(element => {
                        htmlContent += createJobCard(element, true);
                    });

                    document.getElementById("home-card-section").innerHTML = htmlContent;
                } else {
                    document.getElementById("home-card-section").innerHTML = noDataCard();
                }

                document.querySelectorAll('.job-card').forEach(card => {
                    card.addEventListener('click', function () {
                        const originalLink = this.getAttribute('data-original-link');
                        window.open(originalLink, '_blank');
                    });
                });
            }
        }).catch(error => {
            console.error("Error fetching jobs:", error);
        });
    }

    getJobs();

    async function getCategories() {
        let o = `<option value="">Bütün Kateqoriyalar</option>`;
        await axios.get('/api/categories', {
            params: { site: "bossAz" }
        })
            .then(res => {
                if (res.status === 200) {
                    Object.values(res.data).forEach(element => {
                        o += `<option value="${element.localCategoryId}">${element.categoryName}</option>`
                    });
                    document.getElementById("category-select").innerHTML = o;
                }
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });
    }

    getCategories();

    async function getCities() {
        let o = `<option value="">Bütün Şəhərlər</option>`;

        await axios.get('/api/cities', {
            params: { site: "BossAz" }
        })
            .then(res => {
                if (res.status === 200) {
                    res.data.forEach(element => {
                        o += `
                        <option value="${element.cityId}">${element.name}</option>`
                    })
                    document.getElementById("city-select").innerHTML = o;
                }
            })
            .catch(error => {
                console.error("Error fetching cities:", error);
            });
    }

    getCities();

    async function getStatistics() {
        await axios.get('/statistics')
            .then(res => {
                if (res.status === 200) {
                    document.getElementById("vacancy").innerText = res.data.data.vacancy || 0;
                    document.getElementById("company").innerText = res.data.data.company || 0;
                    document.getElementById("visitor").innerText = res.data.data.visitor || 0;
                    document.getElementById("totalVisitor").innerText = res.data.data.totalVisitor || 0;
                }
            })
            .catch(error => {
                console.error("Error fetching statistics:", error);
            });
    }

    getStatistics();

    document.getElementById("filter-jobs")?.addEventListener("click", () => {
        const categorySelect = document.getElementById('category-select');
        const citySelect = document.getElementById('city-select');
        const keywordInput = document.getElementById('keyword');

        const categoryId = categorySelect?.value || 'all';
        const cityId = citySelect?.value || 'all';
        const keyword = keywordInput?.value?.trim().toLowerCase() || '';

        const baseUrl = `${window.location.origin}/vakansiyalar`;
        const params = new URLSearchParams({
            minSalary: 0,
            maxSalary: 5000,
            offset: 0,
            ...(categoryId && { categoryId }),
            ...(cityId && { cityId }),
            ...(keyword && { keyword }),
        });

        window.location.href = `${baseUrl}?${params.toString()}`;
    });

});
