export default function jobsManager(config = null) {
    if (!config && typeof window !== 'undefined' && window.__JOBS_CONFIG__) {
        config = window.__JOBS_CONFIG__;
    }
    config = config || {};

    return {
        mobileFiltersOpen: false,
        isLoading: false,
        // Multi-select values are stored as arrays
        category: Array.isArray(config.initialCategory) ? config.initialCategory : (config.initialCategory ? [config.initialCategory] : []),
        categoryName: '',
        q: config.initialQuery || '',
        type: Array.isArray(config.initialType) ? config.initialType : (config.initialType ? [config.initialType] : []),
        workplace: Array.isArray(config.initialWorkplace) ? config.initialWorkplace : (config.initialWorkplace ? [config.initialWorkplace] : []),
        experience: Array.isArray(config.initialExperience) ? config.initialExperience : (config.initialExperience ? [config.initialExperience] : []),
        city: Array.isArray(config.initialCity) ? config.initialCity : (config.initialCity ? [config.initialCity] : []),
        sort: config.initialSort || 'latest',
        totalCount: config.initialTotal || 0,
        openAccordion: (Array.isArray(config.activeParentCategories) && config.activeParentCategories.length) ? config.activeParentCategories[0] : (config.activeParentCategory || null),
        counts: config.initialCounts || {},
        categoryCounts: config.initialCategoryCounts || {},

        init() {
            if (Array.isArray(config.activeParentCategories) && config.activeParentCategories.length) {
                this.openAccordion = config.activeParentCategories[0];
            } else if (config.activeParentCategory) {
                this.openAccordion = config.activeParentCategory;
            } else if (this.category.length) {
                this.openAccordion = this.category[0];
            }

            // Popstate for browser back/forward buttons
            window.addEventListener('popstate', () => {
                const params = new URLSearchParams(window.location.search);
                this.category = params.getAll('category');
                this.q = params.get('q') || '';
                this.type = params.getAll('type');
                this.workplace = params.getAll('workplace');
                this.experience = params.getAll('experience');
                this.city = params.getAll('city');
                this.sort = params.get('sort') || 'latest';
                if (this.category.length) {
                    this.openAccordion = this.category[0];
                }
                this.fetchJobs(false);
            });

            // Delegate pagination clicks
            document.addEventListener('click', (e) => {
                const pageLink = e.target.closest('.pagination-wrapper a');
                if (pageLink && pageLink.href) {
                    e.preventDefault();
                    this.fetchJobsFromUrl(pageLink.href);
                }
            });
        },

        get hasActiveFilters() {
            return !!(this.category.length || this.q || this.type.length || this.workplace.length || this.experience.length || this.city.length || (this.sort && this.sort !== 'latest'));
        },

        isAccordionOpen(slug) {
            return this.openAccordion === slug;
        },

        toggleAccordion(slug) {
            this.openAccordion = this.openAccordion === slug ? null : slug;
        },

        getCount(group, slug, fallback = 0) {
            if (this.counts && this.counts[group] && this.counts[group][slug] !== undefined) {
                return this.counts[group][slug];
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
            return this.category.includes(slug);
        },

        // Category multi-select toggle (with accordion management)
        toggleCategory(slug, parentSlug = null) {
            const idx = this.category.indexOf(slug);
            const wasActive = idx > -1;
            if (wasActive) {
                this.category.splice(idx, 1);
            } else {
                this.category.push(slug);
            }
            if (parentSlug) {
                // subcategory: keep parent accordion open so selection is visible
                this.openAccordion = parentSlug;
            } else if (wasActive) {
                // parent deselected -> collapse its children
                if (this.openAccordion === slug) this.openAccordion = null;
            } else {
                // parent selected -> reveal its children
                this.openAccordion = slug;
            }
            this.applyFilters();
        },

        clearCategories() {
            this.category = [];
            this.openAccordion = null;
            this.applyFilters();
        },

        toggleFilter(filterName, value) {
            const arr = this[filterName];
            const idx = arr.indexOf(value);
            if (idx > -1) {
                arr.splice(idx, 1);
            } else {
                arr.push(value);
            }
            this.applyFilters();
        },

        resetAllFilters() {
            this.category = [];
            this.q = '';
            this.type = [];
            this.workplace = [];
            this.experience = [];
            this.city = [];
            this.sort = 'latest';
            this.openAccordion = null;
            this.applyFilters();
        },

        buildUrl(baseUrl = window.location.pathname) {
            const params = new URLSearchParams();
            if (this.q) params.set('q', this.q);
            if (this.category.length) this.category.forEach(v => params.append('category[]', v));
            if (this.type.length) this.type.forEach(v => params.append('type[]', v));
            if (this.workplace.length) this.workplace.forEach(v => params.append('workplace[]', v));
            if (this.experience.length) this.experience.forEach(v => params.append('experience[]', v));
            if (this.city.length) this.city.forEach(v => params.append('city[]', v));
            if (this.sort && this.sort !== 'latest') params.set('sort', this.sort);

            const qs = params.toString();
            return qs ? `${baseUrl}?${qs}` : baseUrl;
        },

        applyFilters() {
            const newUrl = this.buildUrl();
            window.history.pushState(null, '', newUrl);
            this.fetchJobs(false);
        },

        async fetchJobsFromUrl(url) {
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
                    const container = document.getElementById('jobs-container');
                    if (container) {
                        container.innerHTML = data.html;
                    }
                    this.totalCount = data.total;
                    this.categoryName = data.selectedCategory ? data.selectedCategory.name : '';
                    if (data.counts) {
                        this.counts = data.counts;
                        if (data.counts.categories) {
                            this.categoryCounts = data.counts.categories;
                        }
                    }
                    window.scrollTo({ top: 150, behavior: 'smooth' });
                }
            } catch (err) {
                console.error('Failed to load jobs:', err);
            } finally {
                this.isLoading = false;
            }
        },

        async fetchJobs(updateUrl = true) {
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
                    const container = document.getElementById('jobs-container');
                    if (container) {
                        container.innerHTML = data.html;
                    }
                    this.totalCount = data.total;
                    this.categoryName = data.selectedCategory ? data.selectedCategory.name : '';
                    if (data.counts) {
                        this.counts = data.counts;
                        if (data.counts.categories) {
                            this.categoryCounts = data.counts.categories;
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to filter jobs:', err);
            } finally {
                this.isLoading = false;
            }
        }
    };
}
