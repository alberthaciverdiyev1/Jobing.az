export default function jobSeekersManager(config = null) {
    if (!config && typeof window !== 'undefined' && window.__JOB_SEEKERS_CONFIG__) {
        config = window.__JOB_SEEKERS_CONFIG__;
    }
    config = config || {};

    return {
        mobileFiltersOpen: false,
        isLoading: false,
        q: config.initialQuery || '',
        category: Array.isArray(config.initialCategory) ? config.initialCategory : (config.initialCategory ? [config.initialCategory] : []),
        city: Array.isArray(config.initialCity) ? config.initialCity : (config.initialCity ? [config.initialCity] : []),
        workplaceType: Array.isArray(config.initialWorkplaceType) ? config.initialWorkplaceType : (config.initialWorkplaceType ? [config.initialWorkplaceType] : []),
        jobType: Array.isArray(config.initialJobType) ? config.initialJobType : (config.initialJobType ? [config.initialJobType] : []),
        experienceLevel: Array.isArray(config.initialExperienceLevel) ? config.initialExperienceLevel : (config.initialExperienceLevel ? [config.initialExperienceLevel] : []),
        sort: config.initialSort || 'latest',
        totalCount: config.initialTotal || 0,
        openAccordions: Array.isArray(config.activeParentCategories) ? [...config.activeParentCategories] : [],
        categoryChildrenMap: config.categoryChildrenMap || {},
        cityCounts: config.initialCityCounts || {},

        init() {
            if (this.category.length) {
                this.category.forEach(c => {
                    if (c && !this.openAccordions.includes(c)) {
                        this.openAccordions.push(c);
                    }
                });
            }

            // Popstate for browser back/forward buttons
            window.addEventListener('popstate', () => {
                const params = new URLSearchParams(window.location.search);
                this.q = params.get('q') || '';
                this.category = params.getAll('category');
                this.city = params.getAll('city');
                this.workplaceType = params.getAll('workplace_type');
                this.jobType = params.getAll('job_type');
                this.experienceLevel = params.getAll('experience_level');
                this.sort = params.get('sort') || 'latest';
                if (this.category.length) {
                    this.category.forEach(c => {
                        if (c && !this.openAccordions.includes(c)) {
                            this.openAccordions.push(c);
                        }
                    });
                }
                this.fetchSeekers(false);
            });

            // Delegate pagination clicks
            document.addEventListener('click', (e) => {
                const pageLink = e.target.closest('.pagination-wrapper a');
                if (pageLink && pageLink.href) {
                    e.preventDefault();
                    this.fetchSeekersFromUrl(pageLink.href);
                }
            });
        },

        get hasActiveFilters() {
            return !!(
                this.q ||
                this.category.length ||
                this.city.length ||
                this.workplaceType.length ||
                this.jobType.length ||
                this.experienceLevel.length ||
                (this.sort && this.sort !== 'latest')
            );
        },

        isAccordionOpen(slug) {
            return this.openAccordions.includes(slug);
        },

        toggleAccordion(slug) {
            const idx = this.openAccordions.indexOf(slug);
            if (idx > -1) {
                this.openAccordions.splice(idx, 1);
            } else {
                this.openAccordions.push(slug);
            }
        },

        isCategoryActive(slug) {
            return this.category.includes(slug);
        },

        toggleCategory(slug, parentSlug = null) {
            const idx = this.category.indexOf(slug);
            const wasActive = idx > -1;

            if (wasActive) {
                this.category.splice(idx, 1);
            } else {
                this.category.push(slug);

                // If a subcategory was selected, remove parent category from search
                if (parentSlug) {
                    const parentIdx = this.category.indexOf(parentSlug);
                    if (parentIdx > -1) {
                        this.category.splice(parentIdx, 1);
                    }
                }

                // If parent was selected, remove any child subcategories
                const childrenSlugs = this.categoryChildrenMap[slug] || [];
                if (childrenSlugs && childrenSlugs.length) {
                    this.category = this.category.filter(c => !childrenSlugs.includes(c));
                }
            }

            // Open accordion
            if (parentSlug) {
                if (!this.openAccordions.includes(parentSlug)) {
                    this.openAccordions.push(parentSlug);
                }
            } else {
                if (!this.openAccordions.includes(slug)) {
                    this.openAccordions.push(slug);
                }
            }

            this.applyFilters();
        },

        clearCategories() {
            this.category = [];
            this.applyFilters();
        },

        toggleFilter(filterName, value) {
            const arr = this[filterName];
            if (!arr) return;
            const idx = arr.indexOf(value);
            if (idx > -1) {
                arr.splice(idx, 1);
            } else {
                arr.push(value);
            }
            this.applyFilters();
        },

        isFilterSelected(filterName, value) {
            const arr = this[filterName];
            return arr ? arr.includes(value) : false;
        },

        getCityCount(name, fallback = 0) {
            if (this.cityCounts && this.cityCounts[name] !== undefined) {
                return this.cityCounts[name];
            }
            return fallback;
        },

        resetAllFilters() {
            this.q = '';
            this.category = [];
            this.city = [];
            this.workplaceType = [];
            this.jobType = [];
            this.experienceLevel = [];
            this.sort = 'latest';
            this.openAccordions = [];
            this.applyFilters();
        },

        buildUrl(baseUrl = window.location.pathname) {
            const params = new URLSearchParams();
            if (this.q) params.set('q', this.q);
            if (this.category.length) this.category.forEach(v => params.append('category[]', v));
            if (this.city.length) this.city.forEach(v => params.append('city[]', v));
            if (this.workplaceType.length) this.workplaceType.forEach(v => params.append('workplace_type[]', v));
            if (this.jobType.length) this.jobType.forEach(v => params.append('job_type[]', v));
            if (this.experienceLevel.length) this.experienceLevel.forEach(v => params.append('experience_level[]', v));
            if (this.sort && this.sort !== 'latest') params.set('sort', this.sort);

            const qs = params.toString();
            return qs ? `${baseUrl}?${qs}` : baseUrl;
        },

        applyFilters() {
            const newUrl = this.buildUrl();
            window.history.pushState(null, '', newUrl);
            this.fetchSeekers(false);
        },

        async fetchSeekersFromUrl(url) {
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
                    const container = document.getElementById('job-seekers-container');
                    if (container) {
                        container.innerHTML = data.html;
                    }
                    this.totalCount = data.total;
                    if (data.cityCounts) {
                        this.cityCounts = data.cityCounts;
                    }
                    window.scrollTo({ top: 150, behavior: 'smooth' });
                }
            } catch (err) {
                console.error('Failed to load job seekers:', err);
            } finally {
                this.isLoading = false;
            }
        },

        async fetchSeekers(updateUrl = true) {
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
                    const container = document.getElementById('job-seekers-container');
                    if (container) {
                        container.innerHTML = data.html;
                    }
                    this.totalCount = data.total;
                    if (data.cityCounts) {
                        this.cityCounts = data.cityCounts;
                    }
                }
            } catch (err) {
                console.error('Failed to filter job seekers:', err);
            } finally {
                this.isLoading = false;
            }
        }
    };
}
