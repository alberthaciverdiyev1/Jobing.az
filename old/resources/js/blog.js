export default function blogManager(config = null) {
    if (!config && typeof window !== 'undefined' && window.__BLOG_CONFIG__) {
        config = window.__BLOG_CONFIG__;
    }
    config = config || {};

    return {
        isLoading: false,
        category: config.initialCategory || '',
        q: config.initialQuery || '',
        totalCount: config.initialTotal || 0,

        init() {
            // Popstate for browser back/forward buttons
            window.addEventListener('popstate', () => {
                const params = new URLSearchParams(window.location.search);
                this.category = params.get('category') || '';
                this.q = params.get('q') || params.get('search') || '';
                this.fetchBlogs(false);
            });

            // Delegate pagination clicks
            document.addEventListener('click', (e) => {
                const pageLink = e.target.closest('.pagination-wrapper a');
                if (pageLink && pageLink.href) {
                    e.preventDefault();
                    this.fetchBlogsFromUrl(pageLink.href);
                }
            });
        },

        get hasActiveFilters() {
            return !!(this.category || this.q);
        },

        selectCategory(cat) {
            this.category = (this.category === cat) ? '' : cat;
            this.applyFilters();
        },

        isCategoryActive(cat) {
            return this.category === cat;
        },

        resetAllFilters() {
            this.category = '';
            this.q = '';
            this.applyFilters();
        },

        buildUrl(baseUrl = window.location.pathname) {
            const params = new URLSearchParams();
            if (this.category) params.set('category', this.category);
            if (this.q) params.set('q', this.q);

            const qs = params.toString();
            return qs ? `${baseUrl}?${qs}` : baseUrl;
        },

        applyFilters() {
            const newUrl = this.buildUrl();
            window.history.pushState(null, '', newUrl);
            this.fetchBlogs(false);
        },

        async fetchBlogsFromUrl(url) {
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
                    const container = document.getElementById('blog-container');
                    if (container) {
                        container.innerHTML = data.html;
                    }
                    this.totalCount = data.total;
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                }
            } catch (err) {
                console.error('Failed to load blog posts:', err);
            } finally {
                this.isLoading = false;
            }
        },

        async fetchBlogs(updateUrl = true) {
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
                    const container = document.getElementById('blog-container');
                    if (container) {
                        container.innerHTML = data.html;
                    }
                    this.totalCount = data.total;
                }
            } catch (err) {
                console.error('Failed to filter blog posts:', err);
            } finally {
                this.isLoading = false;
            }
        }
    };
}
