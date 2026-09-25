import { fetchFilterJson } from './filterRequest';

export default function jobSeekersManager(config = null) {
    if (!config && typeof window !== 'undefined' && window.__JOB_SEEKERS_CONFIG__) {
        config = window.__JOB_SEEKERS_CONFIG__;
    }
    config = config || {};

    return {
        mobileFiltersOpen: false,
        isLoading: false,
        errorMessage: '',
        requestController: null,
        filterErrorMessage: config.filterErrorMessage || '',
        q: config.initialQuery || '',
        minSalary: config.initialMinSalary || '',
        maxSalary: config.initialMaxSalary || '',
        category: Array.isArray(config.initialCategory) ? config.initialCategory : (config.initialCategory ? [config.initialCategory] : []),
        city: Array.isArray(config.initialCity) ? config.initialCity : (config.initialCity ? [config.initialCity] : []),
        workplaceType: Array.isArray(config.initialWorkplaceType) ? config.initialWorkplaceType : (config.initialWorkplaceType ? [config.initialWorkplaceType] : []),
        jobType: Array.isArray(config.initialJobType) ? config.initialJobType : (config.initialJobType ? [config.initialJobType] : []),
        experienceLevel: Array.isArray(config.initialExperienceLevel) ? config.initialExperienceLevel : (config.initialExperienceLevel ? [config.initialExperienceLevel] : []),
        sort: config.initialSort || 'latest',
        totalCount: config.initialTotal || 0,
        skills: Array.isArray(config.initialSkills) ? config.initialSkills : (config.initialSkills ? [config.initialSkills] : []),
        availableSkills: [],
        skillsLoading: false,
        skillsCache: {},
        skillSearch: '',
        openAccordions: Array.isArray(config.activeParentCategories) ? [...config.activeParentCategories] : [],
        categoryChildrenMap: config.categoryChildrenMap || {},
        categoryParentMap: config.categoryParentMap || {},
        parentCategorySlugs: config.parentCategorySlugs || [],
        categoryNameMap: config.categoryNameMap || {},
        workplaceTypeNameMap: config.workplaceTypeNameMap || {},
        experienceLevelNameMap: config.experienceLevelNameMap || {},
        jobTypeNameMap: config.jobTypeNameMap || {},
        cityCounts: config.initialCityCounts || {},
        categoryCounts: config.initialCategoryCounts || {},
        parentCategory: '',
        activeDropdown: null,
        moreFiltersOpen: false,

        init() {
            this.$watch('moreFiltersOpen', (isOpen) => {
                window.dispatchEvent(new CustomEvent('mobile-navbar-visibility', {
                    detail: { visible: !isOpen },
                }));
            });

            this.loadSkills();
            if (this.category.length) {
                const first = this.category[0];
                this.parentCategory = (this.categoryParentMap && this.categoryParentMap[first]) || (this.parentCategorySlugs && this.parentCategorySlugs.includes(first) ? first : first);
                this.category.forEach(c => {
                    const parent = this.categoryParentMap[c] || c;
                    if (parent && !this.openAccordions.includes(parent)) {
                        this.openAccordions.push(parent);
                    }
                });
            }

            // Popstate for browser back/forward buttons
            window.addEventListener('popstate', () => {
                const params = new URLSearchParams(window.location.search);
                this.q = params.get('q') || '';
                this.minSalary = params.get('min_salary') || '';
                this.maxSalary = params.get('max_salary') || '';
                const queryCategories = params.getAll('category[]').concat(params.getAll('category'));
                const subcategory = params.getAll('subcategory[]').concat(params.getAll('subcategory'));
                const combinedCategories = [...new Set([...queryCategories, ...subcategory])].filter(Boolean);
                this.category = combinedCategories;
                if (this.category.length) {
                    const first = this.category[0];
                    this.parentCategory = (this.categoryParentMap && this.categoryParentMap[first]) || (this.parentCategorySlugs && this.parentCategorySlugs.includes(first) ? first : first);
                } else {
                    this.parentCategory = '';
                }
                const queryCity = params.get('city');
                this.city = queryCity ? [queryCity] : [];
                this.workplaceType = params.getAll('workplace_type');
                this.jobType = params.getAll('job_type');
                this.experienceLevel = params.getAll('experience_level');
                this.skills = params.getAll('skills[]').concat(params.getAll('skills')).filter(Boolean);
                this.sort = params.get('sort') || 'latest';
                this.loadSkills();

                if (this.category.length) {
                    this.category.forEach(c => {
                        const parent = this.categoryParentMap[c] || c;
                        if (parent && !this.openAccordions.includes(parent)) {
                            this.openAccordions.push(parent);
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
                this.minSalary ||
                this.maxSalary ||
                this.category.length ||
                this.city.length ||
                this.workplaceType.length ||
                this.jobType.length ||
                this.experienceLevel.length ||
                this.skills.length ||
                (this.sort && this.sort !== 'latest')
            );
        },

        get moreFiltersCount() {
            return (this.jobType ? this.jobType.length : 0) + (this.skills ? this.skills.length : 0) + (this.workplaceType ? this.workplaceType.length : 0);
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
            if (!this.workplaceType || !this.workplaceType.length) return '';
            if (this.workplaceType.length === 1) {
                return this.workplaceTypeNameMap[this.workplaceType[0]] || this.workplaceType[0];
            }
            return `${this.workplaceType.length}`;
        },

        get selectedExperienceLabel() {
            if (!this.experienceLevel || !this.experienceLevel.length) return '';
            if (this.experienceLevel.length === 1) {
                return this.experienceLevelNameMap[this.experienceLevel[0]] || this.experienceLevel[0];
            }
            return `${this.experienceLevel.length}`;
        },

        get salaryLabel() {
            if (this.minSalary && this.maxSalary) {
                return `${this.minSalary} - ${this.maxSalary} ₼`;
            }
            if (this.minSalary) {
                return `≥ ${this.minSalary} ₼`;
            }
            if (this.maxSalary) {
                return `≤ ${this.maxSalary} ₼`;
            }
            return '';
        },

        normalizeSalaryRange() {
            if (this.minSalary !== '' && this.maxSalary !== '' && Number(this.minSalary) > Number(this.maxSalary)) {
                [this.minSalary, this.maxSalary] = [this.maxSalary, this.minSalary];
            }
        },

        get selectedCityLabel() {
            return (this.city && this.city.length > 0) ? this.city[0] : '';
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
            const idx = this.workplaceType.indexOf(slug);
            if (idx > -1) {
                this.workplaceType.splice(idx, 1);
            } else {
                this.workplaceType = [slug];
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

        isCategoryActive(slug) {
            return this.category.includes(slug);
        },

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
            if (!arr) return;
            const idx = arr.indexOf(value);
            if (idx > -1) {
                arr.splice(idx, 1);
            } else {
                arr.push(value);
            }
            this.applyFilters();
        },

        toggleCity(name) {
            if (this.city.includes(name)) {
                this.city = [];
            } else {
                this.city = [name];
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

        getCategoryCount(slug, fallback = 0) {
            if (this.categoryCounts && this.categoryCounts[slug] !== undefined) {
                return this.categoryCounts[slug];
            }
            return fallback;
        },

        resetAllFilters() {
            this.q = '';
            this.minSalary = '';
            this.maxSalary = '';
            this.parentCategory = '';
            this.category = [];
            this.city = [];
            this.workplaceType = [];
            this.jobType = [];
            this.experienceLevel = [];
            this.skills = [];
            this.skillSearch = '';
            this.sort = 'latest';
            this.openAccordions = [];
            this.loadSkills();
            this.applyFilters();
        },

        buildUrl(baseUrl = window.location.pathname) {
            const params = new URLSearchParams();
            if (this.q) params.set('q', this.q);
            if (this.minSalary) params.set('min_salary', this.minSalary);
            if (this.maxSalary) params.set('max_salary', this.maxSalary);
            if (this.category.length) this.category.forEach(v => params.append('category[]', v));
            if (this.city.length) params.set('city', this.city[0]);
            if (this.workplaceType.length) this.workplaceType.forEach(v => params.append('workplace_type[]', v));
            if (this.jobType.length) this.jobType.forEach(v => params.append('job_type[]', v));
            if (this.experienceLevel.length) this.experienceLevel.forEach(v => params.append('experience_level[]', v));
            if (this.skills.length) this.skills.forEach(v => params.append('skills[]', v));
            if (this.sort && this.sort !== 'latest') params.set('sort', this.sort);

            const qs = params.toString();
            return qs ? `${baseUrl}?${qs}` : baseUrl;
        },

        applyFilters() {
            this.normalizeSalaryRange();
            const newUrl = this.buildUrl();
            window.history.pushState(null, '', newUrl);
            this.fetchSeekers(false);
        },

        async fetchSeekersFromUrl(url) {
            window.history.pushState(null, '', url);
            this.isLoading = true;

            try {
                const data = await fetchFilterJson(this, url);
                if (data) {
                    const container = document.getElementById('job-seekers-container');
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
                const data = await fetchFilterJson(this, url);
                if (data) {
                    const container = document.getElementById('job-seekers-container');
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
                console.error('Failed to filter job seekers:', err);
            } finally {
                this.isLoading = false;
            }
        }
    };
}
