export default function resumesManager(config = null) {
    if (!config && typeof window !== 'undefined' && window.__RESUMES_CONFIG__) {
        config = window.__RESUMES_CONFIG__;
    }
    config = config || {};

    return {
        mobileFiltersOpen: false,
        isLoading: false,
        q: config.initialQuery || '',
        category: config.initialCategory || '',
        skills: Array.isArray(config.initialSkills) ? config.initialSkills : (config.initialSkills ? [config.initialSkills] : []),
        city: Array.isArray(config.initialCity) ? config.initialCity : (config.initialCity ? [config.initialCity] : []),
        sort: config.initialSort || 'latest',
        totalCount: config.initialTotal || 0,
        cityCounts: config.initialCityCounts || {},
        categoryCounts: config.initialCategoryCounts || {},
        categorySkills: config.categorySkills || {},
        allSkills: config.allSkills || [],

        init() {
            // Popstate for browser back/forward buttons
            window.addEventListener('popstate', () => {
                const params = new URLSearchParams(window.location.search);
                this.q = params.get('q') || '';
                this.category = params.get('category') || '';
                this.skills = params.getAll('skills');
                this.city = params.getAll('city');
                this.sort = params.get('sort') || 'latest';
                this.fetchResumes(false);
            });

            // Delegate pagination clicks
            document.addEventListener('click', (e) => {
                const pageLink = e.target.closest('.pagination-wrapper a');
                if (pageLink && pageLink.href) {
                    e.preventDefault();
                    this.fetchResumesFromUrl(pageLink.href);
                }
            });
        },

        get hasActiveFilters() {
            return !!(this.q || this.category || this.skills.length || this.city.length || (this.sort && this.sort !== 'latest'));
        },

        get filteredSkills() {
            if (!this.category) {
                return this.allSkills;
            }
            return this.categorySkills[this.category] || [];
        },

        getCityCount(name, fallback = 0) {
            if (this.cityCounts && this.cityCounts[name] !== undefined) {
                return this.cityCounts[name];
            }
            return fallback;
        },

        getCategoryCount(slug, fallback = 0) {
            if (this.categoryCounts && this.categoryCounts[slug] !== undefined) {
                return this.categoryCounts[slug];
            }
            return fallback;
        },

        isCategoryActive(slug) {
            return this.category === slug;
        },

        selectCategory(slug) {
            this.category = (this.category === slug) ? '' : slug;
            this.applyFilters();
        },

        isSkillSelected(name) {
            return this.skills.includes(name);
        },

        toggleSkill(name) {
            const idx = this.skills.indexOf(name);
            if (idx > -1) {
                this.skills.splice(idx, 1);
            } else {
                this.skills.push(name);
            }
            this.applyFilters();
        },

        clearSkills() {
            this.skills = [];
            this.applyFilters();
        },

        toggleCity(name) {
            const idx = this.city.indexOf(name);
            if (idx > -1) {
                this.city.splice(idx, 1);
            } else {
                this.city.push(name);
            }
            this.applyFilters();
        },

        resetAllFilters() {
            this.q = '';
            this.category = '';
            this.skills = [];
            this.city = [];
            this.sort = 'latest';
            this.applyFilters();
        },

        buildUrl(baseUrl = window.location.pathname) {
            const params = new URLSearchParams();
            if (this.q) params.set('q', this.q);
            if (this.category) params.set('category', this.category);
            if (this.skills.length) this.skills.forEach(v => params.append('skills[]', v));
            if (this.city.length) this.city.forEach(v => params.append('city[]', v));
            if (this.sort && this.sort !== 'latest') params.set('sort', this.sort);

            const qs = params.toString();
            return qs ? `${baseUrl}?${qs}` : baseUrl;
        },

        applyFilters() {
            const newUrl = this.buildUrl();
            window.history.pushState(null, '', newUrl);
            this.fetchResumes(false);
        },

        async fetchResumesFromUrl(url) {
            window.history.pushState(null, '', url);
            this.isLoading = true;

            try {
                const response = await fetch(url, {
                    cache: 'no-store',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const container = document.getElementById('resumes-container');
                    if (container) {
                        container.innerHTML = data.html;
                    }
                    this.totalCount = data.total;
                    if (data.cityCounts) {
                         this.cityCounts = data.cityCounts;
                    }
                    if (data.categoryCounts) {
                        this.categoryCounts = data.categoryCounts;
                    }
                    window.scrollTo({ top: 150, behavior: 'smooth' });
                }
            } catch (err) {
                console.error('Failed to load resumes:', err);
            } finally {
                this.isLoading = false;
            }
        },

        async fetchResumes(updateUrl = true) {
            const url = this.buildUrl();
            if (updateUrl) {
                window.history.pushState(null, '', url);
            }

            this.isLoading = true;

            try {
                const response = await fetch(url, {
                    cache: 'no-store',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const container = document.getElementById('resumes-container');
                    if (container) {
                        container.innerHTML = data.html;
                    }
                    this.totalCount = data.total;
                    if (data.cityCounts) {
                        this.cityCounts = data.cityCounts;
                    }
                    if (data.categoryCounts) {
                        this.categoryCounts = data.categoryCounts;
                    }
                }
            } catch (err) {
                console.error('Failed to filter resumes:', err);
            } finally {
                this.isLoading = false;
            }
        }
    };
}
