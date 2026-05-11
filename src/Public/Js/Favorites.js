// ============================================
// FAVORITES - Toggle and manage favorite jobs
// ============================================
const Favorites = {
    /** Cache of favorited job IDs */
    ids: new Set(),
    loaded: false,

    /** Load favorite IDs from server */
    async load() {
        try {
            const res = await axios.get('/api/favorites/ids');
            this.ids = new Set(res.data.ids || []);
            this.loaded = true;
        } catch {
            // User not logged in or error — favorites unavailable
            this.loaded = true;
        }
    },

    /** Check if a job is favorited */
    isFavorited(jobId) {
        return this.ids.has(jobId);
    },

    /** Toggle favorite status */
    async toggle(jobId, btn) {
        if (!this.loaded) await this.load();
        const wasFavorited = this.isFavorited(jobId);

        // Optimistic UI update
        if (wasFavorited) {
            this.ids.delete(jobId);
        } else {
            this.ids.add(jobId);
        }
        if (btn) this.updateBtn(btn, !wasFavorited);

        try {
            const res = await axios.post(`/api/favorites/${jobId}`);
            // Sync with server response
            if (res.data.favorited) {
                this.ids.add(jobId);
            } else {
                this.ids.delete(jobId);
            }
            if (btn) this.updateBtn(btn, res.data.favorited);

            // Show toast
            if (window.alertify) {
                alertify.notify(res.data.message || (res.data.favorited ? 'Favorilərə əlavə edildi' : 'Favorilərdən çıxarıldı'), 'success', 3);
            }
        } catch (err) {
            // Revert on failure
            if (wasFavorited) {
                this.ids.add(jobId);
            } else {
                this.ids.delete(jobId);
            }
            if (btn) this.updateBtn(btn, wasFavorited);
        }
    },

    /** Update button visual state */
    updateBtn(btn, favorited) {
        if (!btn) return;
        if (favorited) {
            btn.classList.add('text-red-500');
            btn.classList.remove('text-gray-300', 'hover:text-red-400');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            btn.classList.remove('text-red-500');
            btn.classList.add('text-gray-300', 'hover:text-red-400');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
    },

    /** Create a favorite toggle button element */
    createBtn(jobId, isFavorited) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `favorite-btn flex-shrink-0 transition-colors duration-200 text-sm ${isFavorited ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`;
        btn.innerHTML = isFavorited ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
        btn.title = isFavorited ? 'Favorilərdən çıxar' : 'Favorilərə əlavə et';
        btn.setAttribute('data-job-id', jobId);
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.toggle(jobId, btn);
        });
        return btn;
    }
};

// Auto-load favorites on page load
document.addEventListener('DOMContentLoaded', () => Favorites.load());
