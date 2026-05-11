// News detail page — image fallback, share functionality
document.addEventListener('DOMContentLoaded', function () {
    // Fallback for broken images
    document.querySelectorAll('.news-detail-img, article img').forEach(img => {
        img.addEventListener('error', function () {
            this.src = '/Images/DefaultCompany.png';
        });
    });
});
