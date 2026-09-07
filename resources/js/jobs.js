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
        openAccordions: (Array.isArray(config.activeParentCategories) && config.activeParentCategories.length)
            ? [...config.activeParentCategories]
            : (config.activeParentCategory ? [config.activeParentCategory] : []),
        categoryChildrenMap: config.categoryChildrenMap || {},
        categoryParentMap: config.categoryParentMap || {},
        parentCategorySlugs: config.parentCategorySlugs || [],
        citySlugs: config.citySlugs || [],
        counts: config.initialCounts || {},
        categoryCounts: config.initialCategoryCounts || {},

        init() {
            if (Array.isArray(config.activeParentCategories) && config.activeParentCategories.length) {
                config.activeParentCategories.forEach(p => {
                    if (p && !this.openAccordions.includes(p)) {
                        this.openAccordions.push(p);
                    }
                });
            } else if (config.activeParentCategory && !this.openAccordions.includes(config.activeParentCategory)) {
                this.openAccordions.push(config.activeParentCategory);
            } else if (this.category.length) {
                this.category.forEach(c => {
                    const parent = this.categoryParentMap[c] || c;
                    if (parent && !this.openAccordions.includes(parent)) {
                        this.openAccordions.push(parent);
                    }
                });
            }

            // Popstate for browser back/forward buttons
            window.addEventListener('popstate', () => {
                const pathname = window.location.pathname;
                const pathParts = pathname.replace(/^\/jobs\/?/, '').split('/').filter(Boolean);

                let pathCity = null;
                let pathCategory = null;

                if (pathParts.length === 2) {
                    pathCity = decodeURIComponent(pathParts[0]);
                    pathCategory = decodeURIComponent(pathParts[1]);
                } else if (pathParts.length === 1) {
                    const segment = decodeURIComponent(pathParts[0]);
                    if (this.citySlugs && this.citySlugs.includes(segment)) {
                        pathCity = segment;
                    } else {
                        pathCategory = segment;
                    }
                }

                const params = new URLSearchParams(window.location.search);
                const subcategory = params.get('subcategory');

                if (subcategory) {
                    this.category = [subcategory];
                } else if (pathCategory) {
                    this.category = [pathCategory];
                } else {
                    this.category = params.getAll('category');
                }

                if (pathCity) {
                    this.city = [pathCity];
                } else {
                    this.city = params.getAll('city');
                }

                this.q = params.get('q') || '';
                this.type = params.getAll('type');
                this.workplace = params.getAll('workplace');
                this.experience = params.getAll('experience');
                this.sort = params.get('sort') || 'latest';

                if (this.category.length) {
                    this.category.forEach(c => {
                        const parent = (this.categoryParentMap && this.categoryParentMap[c]) || c;
                        if (parent && !this.openAccordions.includes(parent)) {
                            this.openAccordions.push(parent);
                        }
                    });
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
            return !!(
                this.category.length ||
                this.q ||
                this.type.length ||
                this.workplace.length ||
                this.experience.length ||
                this.city.length ||
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

                // If a subcategory (child) was selected, ensure its parent category is NOT in search
                if (parentSlug) {
                    const parentIdx = this.category.indexOf(parentSlug);
                    if (parentIdx > -1) {
                        this.category.splice(parentIdx, 1);
                    }
                }

                // If a parent category was selected, remove any of its selected children from search
                const childrenSlugs = this.categoryChildrenMap[slug] || [];
                if (childrenSlugs && childrenSlugs.length) {
                    this.category = this.category.filter(c => !childrenSlugs.includes(c));
                }
            }

            // Always open subcategories when category is clicked
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
            this.openAccordions = [];
            this.applyFilters();
        },

        buildUrl() {
            // 1. Identify primary city slug (if any)
            let citySlug = null;
            if (this.city.length > 0) {
                citySlug = this.city[0].toLowerCase().trim().replace(/\s+/g, '-');
            }

            // 2. Identify category & subcategory slugs
            let categorySlug = null;
            let subcategorySlug = null;

            if (this.category.length > 0) {
                const primaryCat = this.category[0].toLowerCase().trim().replace(/\s+/g, '-');

                // Check if primaryCat is a subcategory (has a parent in categoryParentMap)
                if (this.categoryParentMap && this.categoryParentMap[primaryCat]) {
                    categorySlug = this.categoryParentMap[primaryCat];
                    subcategorySlug = primaryCat;
                } else {
                    // It is a main category
                    categorySlug = primaryCat;
                }
            }

            // 3. Build pathname
            let pathname = '/jobs';
            if (citySlug && categorySlug) {
                pathname = `/jobs/${encodeURIComponent(citySlug)}/${encodeURIComponent(categorySlug)}`;
            } else if (citySlug && !categorySlug) {
                pathname = `/jobs/${encodeURIComponent(citySlug)}`;
            } else if (!citySlug && categorySlug) {
                pathname = `/jobs/${encodeURIComponent(categorySlug)}`;
            }

            // 4. Build query parameters
            const params = new URLSearchParams();

            // If subcategory exists, set ?subcategory={subcategorySlug}
            if (subcategorySlug) {
                params.set('subcategory', subcategorySlug);
            }

            // If there are additional subcategories / categories beyond the first
            if (this.category.length > 1) {
                this.category.slice(1).forEach(c => params.append('category[]', c));
            }

            // If there are additional cities beyond the first
            if (this.city.length > 1) {
                this.city.slice(1).forEach(c => params.append('city[]', c));
            }

            if (this.q) params.set('q', this.q);
            if (this.type.length) this.type.forEach(v => params.append('type[]', v));
            if (this.workplace.length) this.workplace.forEach(v => params.append('workplace[]', v));
            if (this.experience.length) this.experience.forEach(v => params.append('experience[]', v));
            if (this.sort && this.sort !== 'latest') params.set('sort', this.sort);

            const qs = params.toString();
            return qs ? `${pathname}?${qs}` : pathname;
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
