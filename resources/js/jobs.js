import { fetchFilterJson } from './filterRequest';

export default function jobsManager(config = null) {
    if (!config && typeof window !== 'undefined' && window.__JOBS_CONFIG__) {
        config = window.__JOBS_CONFIG__;
    }
    config = config || {};

    return {
        mobileFiltersOpen: false,
        isLoading: false,
        errorMessage: '',
        requestController: null,
        filterErrorMessage: config.filterErrorMessage || '',
        // Multi-select values are stored as arrays
        category: Array.isArray(config.initialCategory) ? config.initialCategory : (config.initialCategory ? [config.initialCategory] : []),
        categoryName: '',
        q: config.initialQuery || '',
        min_salary: config.initialMinSalary || '',
        max_salary: config.initialMaxSalary || '',
        type: Array.isArray(config.initialType) ? config.initialType : (config.initialType ? [config.initialType] : []),
        workplace: Array.isArray(config.initialWorkplace) ? config.initialWorkplace : (config.initialWorkplace ? [config.initialWorkplace] : []),
        experience: Array.isArray(config.initialExperience) ? config.initialExperience : (config.initialExperience ? [config.initialExperience] : []),
        city: Array.isArray(config.initialCity) ? config.initialCity : (config.initialCity ? [config.initialCity] : []),
        sort: config.initialSort || 'latest',
        totalCount: config.initialTotal || 0,
        skills: Array.isArray(config.initialSkills) ? config.initialSkills : (config.initialSkills ? [config.initialSkills] : []),
        availableSkills: [],
        skillsLoading: false,
        skillsCache: {},
        skillSearch: '',
        openAccordions: (Array.isArray(config.activeParentCategories) && config.activeParentCategories.length)
            ? [...config.activeParentCategories]
            : (config.activeParentCategory ? [config.activeParentCategory] : []),
        categoryChildrenMap: config.categoryChildrenMap || {},
        categoryParentMap: config.categoryParentMap || {},
        parentCategorySlugs: config.parentCategorySlugs || [],
        citySlugs: config.citySlugs || [],
        counts: config.initialCounts || {},
        categoryCounts: config.initialCategoryCounts || {},
        categoryNameMap: config.categoryNameMap || {},
        workplaceTypeNameMap: config.workplaceTypeNameMap || {},
        experienceLevelNameMap: config.experienceLevelNameMap || {},
        jobTypeNameMap: config.jobTypeNameMap || {},
        cityNameMap: config.cityNameMap || {},
        parentCategory: config.activeParentCategory || '',
        activeDropdown: null,
        moreFiltersOpen: false,
        externalMode: !!config.externalMode,
        externalBasePath: config.externalBasePath || '',

        init() {
            this.$watch('moreFiltersOpen', (isOpen) => {
                window.dispatchEvent(new CustomEvent('mobile-navbar-visibility', {
                    detail: { visible: !isOpen },
                }));
            });

            this.loadSkills();
            if (this.category.length) {
                const first = this.category[0];
                this.parentCategory = (this.categoryParentMap && this.categoryParentMap[first]) || (this.parentCategorySlugs && this.parentCategorySlugs.includes(first) ? first : (config.activeParentCategory || first));
            } else if (config.activeParentCategory) {
                this.parentCategory = config.activeParentCategory;
            }

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

                let pathCity = null;
                let pathCategory = null;

                if (!this.externalMode) {
                    const pathParts = pathname.replace(/^\/jobs\/?/, '').split('/').filter(Boolean);

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
                }

                const params = new URLSearchParams(window.location.search);
                const queryCategories = params.getAll('category[]').concat(params.getAll('category'));
                const querySubcategories = params.getAll('subcategory[]').concat(params.getAll('subcategory'));
                const combinedCategories = [...new Set([...queryCategories, ...querySubcategories])].filter(Boolean);

                if (combinedCategories.length > 0) {
                    this.category = combinedCategories;
                } else if (pathCategory) {
                    this.category = [pathCategory];
                } else {
                    this.category = [];
                }

                if (this.category.length) {
                    const first = this.category[0];
                    this.parentCategory = (this.categoryParentMap && this.categoryParentMap[first]) || (this.parentCategorySlugs && this.parentCategorySlugs.includes(first) ? first : (pathCategory || first));
                } else if (pathCategory) {
                    this.parentCategory = pathCategory;
                } else {
                    this.parentCategory = '';
                }

                if (pathCity) {
                    this.city = [pathCity];
                } else {
                    const queryCities = params.getAll('city[]').concat(params.getAll('city')).filter(Boolean);
                    this.city = queryCities;
                }

                this.q = params.get('q') || '';
                this.min_salary = params.get('min_salary') || '';
                this.max_salary = params.get('max_salary') || '';
                this.type = params.getAll('type');
                this.workplace = params.getAll('workplace');
                this.experience = params.getAll('experience');
                this.skills = params.getAll('skills[]').concat(params.getAll('skills')).filter(Boolean);
                this.sort = params.get('sort') || 'latest';
                this.loadSkills();

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
                this.min_salary ||
                this.max_salary ||
                this.type.length ||
                this.workplace.length ||
                this.experience.length ||
                this.city.length ||
                this.skills.length ||
                (this.sort && this.sort !== 'latest')
            );
        },

        get moreFiltersCount() {
            return (this.type ? this.type.length : 0) + (this.skills ? this.skills.length : 0);
        },

        toggleDropdown(name) {
            this.activeDropdown = (this.activeDropdown === name) ? null : name;
        },

        closeDropdown(name = null) {
            if (!name || this.activeDropdown === name) {
                this.activeDropdown = null;
            }
        },

        closeAllDropdowns() {
            this.activeDropdown = null;
        },

        get selectedParentCategorySlug() {
            if (this.parentCategory) return this.parentCategory;
            if (!this.category || !this.category.length) return '';
            const cat = this.category[0];
            if (this.categoryParentMap && this.categoryParentMap[cat]) {
                return this.categoryParentMap[cat];
            }
            if (this.parentCategorySlugs && this.parentCategorySlugs.includes(cat)) {
                return cat;
            }
            if (this.categoryChildrenMap && this.categoryChildrenMap[cat]) {
                return cat;
            }
            return cat;
        },

        get selectedSubcategorySlugs() {
            if (!this.category || !this.category.length) return [];
            const parent = this.selectedParentCategorySlug;
            return this.category.filter(c => this.categoryParentMap && this.categoryParentMap[c] === parent);
        },

        get availableSubcategories() {
            const parent = this.selectedParentCategorySlug;
            if (!parent || !this.categoryChildrenMap || !this.categoryChildrenMap[parent]) {
                return [];
            }
            return this.categoryChildrenMap[parent];
        },

        get selectedParentCategoryLabel() {
            const slug = this.selectedParentCategorySlug;
            if (!slug) return '';
            return this.categoryNameMap[slug] || slug;
        },

        get selectedSubcategoryLabel() {
            const subs = this.selectedSubcategorySlugs;
            if (!subs || !subs.length) return '';
            if (subs.length === 1) {
                return this.categoryNameMap[subs[0]] || subs[0];
            }
            const first = this.categoryNameMap[subs[0]] || subs[0];
            return `${first} (+${subs.length - 1})`;
        },

        isSubcategorySelected(slug) {
            return this.selectedSubcategorySlugs.includes(slug);
        },

        setParentCategory(slug) {
            if (!slug) {
                this.parentCategory = '';
                this.category = [];
            } else {
                this.parentCategory = slug;
                this.category = [slug];
            }
            this.closeDropdown('category');
            this.loadSkills();
            this.applyFilters();
        },

        toggleSubcategory(slug) {
            const parent = this.selectedParentCategorySlug;
            let currentSubs = [...this.selectedSubcategorySlugs];
            const idx = currentSubs.indexOf(slug);
            if (idx > -1) {
                currentSubs.splice(idx, 1);
            } else {
                currentSubs.push(slug);
            }

            if (currentSubs.length > 0) {
                this.category = currentSubs;
            } else {
                this.category = parent ? [parent] : [];
            }
            this.loadSkills();
            this.applyFilters();
        },

        clearSubcategories() {
            const parent = this.selectedParentCategorySlug;
            this.category = parent ? [parent] : [];
            this.loadSkills();
            this.applyFilters();
        },

        async loadSkills() {
            const parentSlug = this.selectedParentCategorySlug;
            const subSlugs = this.selectedSubcategorySlugs;

            const cacheKey = `${parentSlug || ''}::${[...subSlugs].sort().join(',')}`;
            if (this.skillsCache[cacheKey]) {
                this.availableSkills = this.skillsCache[cacheKey];
                return;
            }

            this.skillsLoading = true;
            try {
                const params = new URLSearchParams();
                if (subSlugs.length > 0) {
                    subSlugs.forEach(s => params.append('subcategory[]', s));
                } else if (parentSlug) {
                    params.set('category', parentSlug);
                }

                const res = await fetch(`/api/skills?${params.toString()}`, {
                    headers: { 'Accept': 'application/json' }
                });
                if (res.ok) {
                    const data = await res.json();
                    const list = data.skills || [];
                    this.skillsCache[cacheKey] = list;
                    this.availableSkills = list;
                }
            } catch (e) {
                console.error('Failed to load skills:', e);
            } finally {
                this.skillsLoading = false;
            }
        },

        get filteredAvailableSkills() {
            if (!this.skillSearch) {
                return this.availableSkills;
            }
            const q = this.skillSearch.toLowerCase().trim();
            return this.availableSkills.filter(s => s.name.toLowerCase().includes(q));
        },

        toggleSkill(name) {
            const idx = this.skills.indexOf(name);
            if (idx > -1) {
                this.skills.splice(idx, 1);
            } else {
                this.skills.push(name);
            }
        },

        isSkillSelected(name) {
            return this.skills.includes(name);
        },

        clearSkills() {
            this.skills = [];
        },

        get selectedWorkplaceLabel() {
            if (!this.workplace || !this.workplace.length) return '';
            if (this.workplace.length === 1) {
                return this.workplaceTypeNameMap[this.workplace[0]] || this.workplace[0];
            }
            return `${this.workplace.length}`;
        },

        get selectedExperienceLabel() {
            if (!this.experience || !this.experience.length) return '';
            if (this.experience.length === 1) {
                return this.experienceLevelNameMap[this.experience[0]] || this.experience[0];
            }
            return `${this.experience.length}`;
        },

        get salaryLabel() {
            if (this.min_salary && this.max_salary) {
                return `${this.min_salary} - ${this.max_salary} ₼`;
            }
            if (this.min_salary) {
                return `≥ ${this.min_salary} ₼`;
            }
            if (this.max_salary) {
                return `≤ ${this.max_salary} ₼`;
            }
            return '';
        },

        normalizeSalaryRange() {
            if (this.min_salary !== '' && this.max_salary !== '' && Number(this.min_salary) > Number(this.max_salary)) {
                [this.min_salary, this.max_salary] = [this.max_salary, this.min_salary];
            }
        },

        get selectedCityLabel() {
            if (!this.city || !this.city.length) return '';
            return this.cityNameMap[this.city[0]] || this.city[0];
        },

        setPopularSearch(term) {
            if (this.q === term) {
                this.q = '';
            } else {
                this.q = term;
            }
            this.applyFilters();
        },

        togglePopularWorkplace(slug = 'uzaktan') {
            const idx = this.workplace.indexOf(slug);
            if (idx > -1) {
                this.workplace.splice(idx, 1);
            } else {
                this.workplace = [slug];
            }
            this.applyFilters();
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

        // Category toggle (parent categories are single-select, subcategories belong to one parent family)
        toggleCategory(slug, parentSlug = null) {
            const idx = this.category.indexOf(slug);
            const wasActive = idx > -1;

            if (wasActive) {
                this.category.splice(idx, 1);
            } else {
                if (parentSlug) {
                    // Subcategory clicked:
                    // Keep only sibling subcategories of the SAME parent category, remove other parents/children
                    const allowedChildren = this.categoryChildrenMap[parentSlug] || [];
                    this.category = this.category.filter(c => allowedChildren.includes(c) && c !== parentSlug);
                    this.category.push(slug);

                    if (!this.openAccordions.includes(parentSlug)) {
                        this.openAccordions.push(parentSlug);
                    }
                } else {
                    // Parent category clicked:
                    // Parent categories cannot be multi-selected: clear other parents & their subcategories
                    this.category = [slug];

                    if (!this.openAccordions.includes(slug)) {
                        this.openAccordions.push(slug);
                    }
                }
            }

            this.applyFilters();
        },

        clearCategories() {
            this.category = [];
            this.applyFilters();
        },

        toggleFilter(filterName, value) {
            if (filterName === 'city') {
                this.toggleCity(value);
                return;
            }
            const arr = this[filterName];
            const idx = arr.indexOf(value);
            if (idx > -1) {
                arr.splice(idx, 1);
            } else {
                arr.push(value);
            }
            this.applyFilters();
        },

        toggleCity(slug) {
            if (this.city.includes(slug)) {
                this.city = [];
            } else {
                this.city = [slug];
            }
            this.applyFilters();
        },

        clearCity() {
            this.city = [];
            this.applyFilters();
        },

        resetAllFilters() {
            this.parentCategory = '';
            this.category = [];
            this.q = '';
            this.min_salary = '';
            this.max_salary = '';
            this.type = [];
            this.workplace = [];
            this.experience = [];
            this.city = [];
            this.skills = [];
            this.skillSearch = '';
            this.sort = 'latest';
            this.openAccordions = [];
            this.loadSkills();
            this.applyFilters();
        },

        buildUrl() {
            // 1. Identify primary city slug (if any)
            let citySlug = null;
            if (this.city.length > 0) {
                citySlug = this.city[0].toLowerCase().trim().replace(/\s+/g, '-');
            }

            // 2. Identify category & subcategory slugs
            const parentSlug = this.selectedParentCategorySlug;
            const subcategorySlugs = this.selectedSubcategorySlugs;
            let categorySlug = parentSlug ? parentSlug.toLowerCase().trim().replace(/\s+/g, '-') : null;

            //    /{category}  |  /{city}  |  /{city}/{category}
            let pathname = this.externalMode ? (this.externalBasePath || '/') : '/';
            if (!this.externalMode) {
                if (citySlug && categorySlug) {
                    pathname = `/${encodeURIComponent(citySlug)}/${encodeURIComponent(categorySlug)}`;
                } else if (citySlug) {
                    pathname = `/${encodeURIComponent(citySlug)}`;
                } else if (categorySlug) {
                    pathname = `/${encodeURIComponent(categorySlug)}`;
                }
            }

            const params = new URLSearchParams();

            if (this.externalMode) {
                if (categorySlug) params.append('category[]', categorySlug);
                if (citySlug) params.append('city[]', citySlug);
            }

            // Alt kateqoriya(lar)
            if (subcategorySlugs.length === 1) {
                params.set('subcategory', subcategorySlugs[0]);
            } else if (subcategorySlugs.length > 1) {
                subcategorySlugs.forEach(s => params.append('subcategory[]', s));
            }

            if (this.q) params.set('q', this.q);
            if (this.min_salary) params.set('min_salary', this.min_salary);
            if (this.max_salary) params.set('max_salary', this.max_salary);
            if (this.type.length) this.type.forEach(v => params.append('type[]', v));
            if (this.workplace.length) this.workplace.forEach(v => params.append('workplace[]', v));
            if (this.experience.length) this.experience.forEach(v => params.append('experience[]', v));
            if (this.skills.length) this.skills.forEach(v => params.append('skills[]', v));
            if (this.sort && this.sort !== 'latest') params.set('sort', this.sort);

            const qs = params.toString();
            return qs ? `${pathname}?${qs}` : pathname;
        },

        applyFilters() {
            this.normalizeSalaryRange();
            const newUrl = this.buildUrl();
            window.history.pushState(null, '', newUrl);
            this.fetchJobs(false);
        },

        async fetchJobsFromUrl(url) {
            window.history.pushState(null, '', url);
            this.isLoading = true;

            try {
                const data = await fetchFilterJson(this, url);
                if (data) {
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
                const data = await fetchFilterJson(this, url);
                if (data) {
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
