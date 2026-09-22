import { fetchFilterJson } from './filterRequest';

export default function companiesManager(config = null) {
    if (!config && typeof window !== 'undefined' && window.__COMPANIES_CONFIG__) {
        config = window.__COMPANIES_CONFIG__;
    }
    config = config || {};

    return {
        isLoading: false,
        errorMessage: '',
        requestController: null,
        filterErrorMessage: config.filterErrorMessage || '',
        q: config.initialQuery || '',
        sort: config.initialSort || 'latest',
        totalCount: config.initialTotal || 0,

        init() {
            // Popstate for browser back/forward buttons
            window.addEventListener('popstate', () => {
                const params = new URLSearchParams(window.location.search);
                this.q = params.get('q') || '';
                this.sort = params.get('sort') || 'latest';
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
                (this.sort && this.sort !== 'latest')
            );
        },

        resetAllFilters() {
            this.q = '';
            this.sort = 'latest';
            this.applyFilters();
        },

        buildUrl(baseUrl = window.location.pathname) {
            const params = new URLSearchParams();
            if (this.q) params.set('q', this.q);
            if (this.sort && this.sort !== 'latest') params.set('sort', this.sort);

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
                const data = await fetchFilterJson(this, url);
                if (data) {
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
                const data = await fetchFilterJson(this, url);
                if (data) {
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
