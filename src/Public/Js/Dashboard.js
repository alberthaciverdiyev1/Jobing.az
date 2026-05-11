document.addEventListener('DOMContentLoaded', () => {
    alertify.set('notifier', 'position', 'top-right');

    // ============================================
    // DELETE CV BUTTONS
    // ============================================
    document.querySelectorAll('.delete-cv-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const cvId = this.dataset.cvId;
            if (!cvId) return;

            alertify.confirm(
                'CV silinsin?',
                'Bu əməliyyat geri alına bilməz.',
                async () => {
                    try {
                        const res = await axios.delete(`/api/cv/${cvId}`);
                        if (res.status === 200) {
                            alertify.success('CV silindi');
                            // Remove the list item with animation
                            const item = this.closest('[class*="flex items-center justify-between"]');
                            if (item) {
                                item.style.transition = 'all 0.3s ease';
                                item.style.opacity = '0';
                                item.style.transform = 'translateX(20px)';
                                setTimeout(() => item.remove(), 300);
                            }
                            // Update counters
                            setTimeout(() => window.location.reload(), 500);
                        }
                    } catch (err) {
                        alertify.error(err.response?.data?.error || 'Xəta baş verdi');
                    }
                },
                () => {} // cancel
            ).set('labels', { ok: 'Sil', cancel: 'İmtina' });
        });
    });
});
