// Favorites (Kaydedilen İlanlar) - client-side manager.
// Fetches saved vacancy ids from the server and toggles them via AJAX.
// Uses event delegation so it works with dynamically-loaded job lists too.

const Favorites = {
    ids: new Set(),
    loaded: false,
    csrf: () => {
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta ? meta.content : '';
    },

    init() {
        this.bindEvents();
        this.fetchIds();
    },

    async fetchIds() {
        try {
            const res = await fetch('/api/favorites/ids', {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            const data = await res.json();
            this.ids = new Set((data.ids || []).map(Number));
            this.loaded = true;
            this.renderAll();
        } catch (e) {
            this.loaded = true;
        }
    },

    bindEvents() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.js-save-job');
            if (!btn) return;
            e.preventDefault();
            e.stopPropagation();
            this.toggle(btn.dataset.vacancyId, btn);
        });
    },

    async toggle(vacancyId, btn) {
        vacancyId = Number(vacancyId);
        if (!vacancyId) return;

        btn.disabled = true;
        try {
            const res = await fetch('/api/favorites/toggle', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': this.csrf(),
                },
                body: JSON.stringify({ vacancy_id: vacancyId }),
            });
            const data = await res.json();
            if (data.success) {
                if (data.is_favorite) this.ids.add(vacancyId);
                else this.ids.delete(vacancyId);
                this.renderAll();
            }
        } catch (e) {
            // ignore network errors, keep current state
        } finally {
            btn.disabled = false;
        }
    },

    renderAll() {
        const badge = document.getElementById('favorites-count-nav');
        if (badge) {
            if (this.ids.size > 0) {
                badge.textContent = this.ids.size > 99 ? '99+' : this.ids.size;
                badge.classList.remove('hidden');
                badge.classList.add('inline-flex');
            } else {
                badge.classList.add('hidden');
                badge.classList.remove('inline-flex');
            }
        }

        document.querySelectorAll('.js-save-job').forEach((btn) => {
            const id = Number(btn.dataset.vacancyId);
            const active = this.ids.has(id);
            btn.classList.toggle('is-saved', active);
            btn.classList.toggle('bg-rose-50', active);
            btn.classList.toggle('border-rose-200', active);
            btn.classList.toggle('text-rose-600', active);

            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = active ? 'fas fa-heart text-sm text-rose-500' : 'far fa-heart text-sm text-rose-500';
            }
            btn.setAttribute('aria-pressed', active ? 'true' : 'false');
            const label = btn.querySelector('.js-save-label');
            if (label) {
                label.textContent = active
                    ? (btn.dataset.savedLabel || 'Saxlanılıb')
                    : (btn.dataset.saveLabel || 'Saxla');
            }
        });
    },
};

export default Favorites;
