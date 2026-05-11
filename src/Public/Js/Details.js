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

// ============================================
// APPLY FUNCTIONALITY (exposed globally for inline onclick)
// ============================================

async function loadUserCvs() {
    try {
        const res = await axios.get('/api/cv');
        return res.data?.cvs || [];
    } catch {
        return [];
    }
}

function closeCvModal() {
    document.getElementById('cvSelectModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

function closeNoCvModal() {
    document.getElementById('noCvModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

function closeSuccessModal() {
    document.getElementById('applySuccessModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

async function openApplyModal() {
    const jobId = document.getElementById('jobId')?.value;
    if (!jobId) return alertify.error('Vakansiya ID tapılmadı');

    // Show loading
    document.getElementById('cvSelectModal').classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.getElementById('cvListContainer').innerHTML = `
        <div class="text-center py-8">
            <div class="w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto"></div>
            <p class="text-gray-400 text-sm mt-3">CV-lər yüklənir...</p>
        </div>`;

    const cvs = await loadUserCvs();

    if (cvs.length === 0) {
        // No CVs — close CV modal, show warning
        closeCvModal();
        document.getElementById('noCvModal').classList.remove('hidden');
        document.body.classList.add('modal-open');
        return;
    }

    // Show CV list
    document.getElementById('cvListContainer').innerHTML = cvs.map(cv => `
        <div onclick="submitApplication('${jobId}', '${cv._id}')"
             class="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50/30 cursor-pointer transition-all duration-200">
            <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                <i class="fas ${cv.type === 'uploaded' ? 'fa-upload' : 'fa-file-alt'}"></i>
            </div>
            <div class="min-w-0 flex-1">
                <p class="font-medium text-gray-900 text-sm truncate">${escapeHtml(cv.title)}</p>
                <p class="text-xs text-gray-400">${cv.type === 'uploaded' ? 'Yüklənmiş CV' : 'Yaradılmış CV'} · ${cv.skills?.length || 0} bacarıq</p>
            </div>
            <i class="fas fa-chevron-right text-xs text-gray-300"></i>
        </div>
    `).join('');
}

async function submitApplication(jobId, cvId) {
    try {
        const res = await axios.post('/api/applications', { jobId, cvId });
        closeCvModal();
        document.getElementById('applySuccessModal').classList.remove('hidden');
        document.body.classList.add('modal-open');
    } catch (err) {
        const msg = err.response?.data?.error || 'Xəta baş verdi';
        alertify.error(msg);
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Expose to global scope for inline onclick
window.openApplyModal = openApplyModal;
window.closeCvModal = closeCvModal;
window.closeNoCvModal = closeNoCvModal;
window.closeSuccessModal = closeSuccessModal;
window.submitApplication = submitApplication;
