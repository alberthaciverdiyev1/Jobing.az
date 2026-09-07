export default function companiesManager(config = null) {
    if (!config && typeof window !== 'undefined' && window.__COMPANIES_CONFIG__) {
        config = window.__COMPANIES_CONFIG__;
    }
    config = config || {};

    return {
        isLoading: false,
        q: config.initialQuery || '',
        sort: config.initialSort || 'latest',
        verified: config.initialVerified || '',
        hasJobs: config.initialHasJobs || '',
        location: config.initialLocation || '',
        totalCount: config.initialTotal || 0,

        init() {
            // Popstate for browser back/forward buttons
            window.addEventListener('popstate', () => {
                const params = new URLSearchParams(window.location.search);
                this.q = params.get('q') || '';
                this.sort = params.get('sort') || 'latest';
                this.verified = params.get('verified') || '';
                this.hasJobs = params.get('has_jobs') || '';
                this.location = params.get('location') || '';
                this.fetchCompanies(false);
            });

            // Delegate pagination clicks
            document.addEventListener('click', (e) => {
                const pageLink = e.target.closest('.pagination-wrapper a');
                if (pageLink && pageLink.href) {
                    e.preventDefault();
                    this.fetchCompaniesFromUrl(pageLink.href);
                }
            });
        },

        get hasActiveFilters() {
            return !!(
                this.q ||
                (this.sort && this.sort !== 'latest') ||
                this.verified ||
                this.hasJobs ||
                this.location
            );
        },

        resetAllFilters() {
            this.q = '';
            this.sort = 'latest';
            this.verified = '';
            this.hasJobs = '';
            this.location = '';
            this.applyFilters();
        },

        buildUrl(baseUrl = window.location.pathname) {
            const params = new URLSearchParams();
            if (this.q) params.set('q', this.q);
            if (this.sort && this.sort !== 'latest') params.set('sort', this.sort);
            if (this.verified) params.set('verified', this.verified);
            if (this.hasJobs) params.set('has_jobs', this.hasJobs);
            if (this.location) params.set('location', this.location);

            const qs = params.toString();
            return qs ? `${baseUrl}?${qs}` : baseUrl;
        },

        applyFilters() {
            const newUrl = this.buildUrl();
            window.history.pushState(null, '', newUrl);
            this.fetchCompanies(false);
        },

        async fetchCompaniesFromUrl(url) {
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
                    const container = document.getElementById('companies-container');
                    if (container) {
                        container.innerHTML = data.html;
                    }
                    this.totalCount = data.total;
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                }
            } catch (err) {
                console.error('Failed to load companies:', err);
            } finally {
                this.isLoading = false;
            }
        },

        async fetchCompanies(updateUrl = true) {
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
                    const container = document.getElementById('companies-container');
                    if (container) {
                        container.innerHTML = data.html;
                    }
                    this.totalCount = data.total;
                }
            } catch (err) {
                console.error('Failed to filter companies:', err);
            } finally {
                this.isLoading = false;
            }
        }
    };
}
