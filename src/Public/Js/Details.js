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
                        if (originalLink) {
                            if (originalLink.startsWith('/')) {
                                window.location.href = originalLink;
                            } else {
                                window.open(originalLink, '_blank');
                            }
                        }
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

// ============================================
// PROMOTION / PRICING FUNCTIONALITY
// ============================================

let selectedPlanId = null;
let pricingType = null;

async function openPricingModal(type) {
    pricingType = type;
    selectedPlanId = null;
    const jobId = document.getElementById('jobId')?.value;
    if (!jobId) return alertify.error('Vakansiya ID tapılmadı');

    document.getElementById('pricingModalTitle').textContent = type === 'premium' ? 'Premium Et' : 'İrəli Çək';
    document.getElementById('pricingModalDesc').textContent = type === 'premium'
        ? 'Premium planlardan birini seçərək vakansiyanızı ön plana çıxarın'
        : 'İrəli çəkmə planları ilə vakansiyanızı daha çox insana çatdırın';

    // Pre-fill phone from currentUser if available
    if (window.currentUser?.phone) {
        document.getElementById('pricingPhone').value = window.currentUser.phone;
    } else {
        document.getElementById('pricingPhone').value = '';
    }

    // Show loading
    document.getElementById('pricingPlansContainer').innerHTML = `
        <div class="text-center py-8">
            <div class="w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto"></div>
            <p class="text-gray-400 text-sm mt-3">Planlar yüklənir...</p>
        </div>`;

    document.getElementById('pricingModal').classList.remove('hidden');
    document.body.classList.add('modal-open');

    // Fetch plans
    await loadPricingPlans(type);
}

async function loadPricingPlans(type) {
    try {
        const { data } = await axios.get('/api/pricing/plans', {
            params: { type }
        });

        const container = document.getElementById('pricingPlansContainer');

        if (!data || data.length === 0) {
            container.innerHTML = `<p class="text-sm text-gray-400 text-center py-4">Bu tip üçün plan mövcud deyil</p>`;
            return;
        }

        container.innerHTML = data.map((plan, index) => `
            <div onclick="selectPlan('${plan._id}', this)"
                 class="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${index === 0 ? 'border-primary-500 bg-primary-50/30' : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50/20'}">
                <div class="w-10 h-10 rounded-xl ${plan.type === 'premium' ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'} flex items-center justify-center text-lg flex-shrink-0">
                    <i class="fas ${plan.type === 'premium' ? 'fa-crown' : 'fa-rocket'}"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-semibold text-gray-900 text-sm">${escapeHtml(plan.name)}</p>
                    <p class="text-xs text-gray-400">${plan.duration === 'daily' ? '1 gün' : '30 gün'} müddət</p>
                </div>
                <div class="text-right flex-shrink-0">
                    <p class="text-lg font-bold text-primary-600">${plan.price} <span class="text-xs font-normal">AZN</span></p>
                </div>
            </div>
        `).join('');

        // Auto-select first plan
        if (data.length > 0) {
            selectPlan(data[0]._id, container.firstElementChild);
        }
    } catch (err) {
        document.getElementById('pricingPlansContainer').innerHTML =
            `<p class="text-sm text-red-400 text-center py-4">Planlar yüklənərkən xəta: ${err.message}</p>`;
    }
}

function selectPlan(planId, el) {
    selectedPlanId = planId;
    // Remove active state from all plan cards
    document.querySelectorAll('#pricingPlansContainer > div').forEach(card => {
        card.classList.remove('border-primary-500', 'bg-primary-50/30');
        card.classList.add('border-gray-200');
    });
    // Set active state on selected
    if (el) {
        el.classList.remove('border-gray-200');
        el.classList.add('border-primary-500', 'bg-primary-50/30');
    }
}

function closePricingModal() {
    document.getElementById('pricingModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
    selectedPlanId = null;
}

async function submitPricingRequest() {
    const jobId = document.getElementById('jobId')?.value;
    const phone = document.getElementById('pricingPhone').value.trim();

    if (!selectedPlanId) return alertify.error('Zəhmət olmasa bir plan seçin');
    if (!phone) return alertify.error('Telefon nömrəsi daxil edin');

    const submitBtn = document.getElementById('submitPricingBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Göndərilir...';

    try {
        const res = await axios.post('/api/pricing/request', {
            planId: selectedPlanId,
            jobId,
            phone
        });

        if (res.data.status === 200) {
            alertify.success(res.data.message || 'Müraciətiniz qeydə alındı');
            closePricingModal();
        } else {
            alertify.error(res.data.error || 'Xəta baş verdi');
        }
    } catch (err) {
        const msg = err.response?.data?.error || err.response?.data?.message || 'Xəta baş verdi';
        alertify.error(msg);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
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
window.openPricingModal = openPricingModal;
window.closePricingModal = closePricingModal;
window.selectPlan = selectPlan;
window.submitPricingRequest = submitPricingRequest;
