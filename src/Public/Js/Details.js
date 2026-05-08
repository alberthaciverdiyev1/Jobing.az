import { createJobCard, noDataCard } from './Helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
    alertify.set('notifier', 'position', 'top-right');

    async function getJobs() {
        await axios.get('/api/jobs', {
            params: { categoryId: document.getElementById('categoryId').value }
        }).then(res => {
            let htmlContent = '';

            if (res.status === 200) {
                if (res.data.totalCount) {
                    let data = res.data.jobs.slice(0, 6);
                    data.forEach(element => {
                        htmlContent += createJobCard(element, true);
                    });

                    document.getElementById("home-card-section").innerHTML = htmlContent;
                } else {
                    document.getElementById("home-card-section").innerHTML = noDataCard();
                }

                document.querySelectorAll('.job-card').forEach(card => {
                    card.addEventListener('click', function () {
                        const originalLink = this.getAttribute('data-original-link');
                        window.open(originalLink, '_blank');
                    });
                });
            }
        }).catch(error => {
            console.error("Error fetching jobs:", error);
        });
    }

    getJobs();

    document.getElementById('copyLinkButton')?.addEventListener('click', function () {
        const copyText = window.location.href;
        navigator.clipboard.writeText(copyText).then(function () {
            alertify.success('Link kopyalandı');
        }).catch(function () {
            alertify.success('Link kopyalana bilmədi');
        });
    });
});
