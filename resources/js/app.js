import './bootstrap';
import Alpine from 'alpinejs';
import { createIcons, icons } from 'lucide';
import jobsManager from './jobs';
import Favorites from './favorites';

window.Alpine = Alpine;
Alpine.data('jobsManager', jobsManager);

// Contact reveal (lead tracking): mask contact until clicked, then fetch & log.
const contactReveal = (url, hasPhone) => ({
    revealed: false,
    loading: false,
    email: '',
    phone: '',
    hasPhone: !!hasPhone,
    csrf: () => (document.querySelector('meta[name="csrf-token"]')?.content || ''),
    async reveal() {
        this.loading = true;
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': this.csrf(),
                },
            });
            const data = await res.json();
            if (data.success) {
                this.email = data.email || '';
                this.phone = data.phone || '';
                this.hasPhone = !!data.phone;
                this.revealed = true;
            }
        } catch (e) {
            // ignore network errors
        } finally {
            this.loading = false;
        }
    },
});
Alpine.data('contactReveal', contactReveal);

window.Favorites = Favorites;

// Initialize Lucide icons helper
window.renderLucideIcons = () => {
    createIcons({ icons });
};

document.addEventListener('DOMContentLoaded', () => {
    window.renderLucideIcons();
    Favorites.init();
});

// Re-render icons on Alpine mutations/transitions
document.addEventListener('alpine:initialized', () => {
    window.renderLucideIcons();
});

Alpine.start();
