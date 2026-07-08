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

    // Pricing buttons — event delegation via data attributes
    document.querySelectorAll('[data-pricing-type]').forEach(btn => {
        btn.addEventListener('click', function () {
            openPricingModal(this.dataset.pricingType);
        });
    });

    document.getElementById('submitPricingBtn')?.addEventListener('click', submitPricingRequest);
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

    const isPremium = type === 'premium';

    // Update accent bar
    const accent = document.getElementById('pricingModalAccent');
    accent.className = 'h-2 bg-gradient-to-r ' + (isPremium ? 'from-purple-400 to-indigo-500' : 'from-amber-400 to-orange-500');

    // Update icon
    const iconBox = document.getElementById('pricingModalIcon');
    iconBox.className = 'w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ' + (isPremium ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600');
    iconBox.innerHTML = '<i class="fas ' + (isPremium ? 'fa-crown' : 'fa-rocket') + '"></i>';

    // Update badge
    const badge = document.getElementById('pricingModalBadge');
    if (isPremium) {
        badge.textContent = 'Premium';
        badge.className = 'text-[10px] font-semibold uppercase tracking-wider text-purple-600';
    } else {
        badge.className = 'hidden';
    }

    // Update title
    document.getElementById('pricingModalTitle').textContent = isPremium ? 'Premium Et' : 'İrəli Çək';

    // Update info box
    document.getElementById('pricingInfoTitle').textContent = isPremium ? 'Premium Nədir?' : 'İrəli Çəkmə Nədir?';
    document.getElementById('pricingInfoText').innerHTML = isPremium
        ? 'Premium planı ilə vakansiyanız <span class="font-medium text-purple-900">premium elanlar kateqoriyasında</span> xüsusi olaraq göstərilir və adi vakansiyalar arasında <span class="font-medium text-purple-900">"Premium" nişanı</span> ilə qeyd olunur.'
        : 'İrəli çəkmə planı ilə vakansiyanız müntəzəm olaraq vakansiyalar siyahısında yuxarı qaldırılır. <span class="font-medium text-amber-900">Aylıq planlarda hər 4 gündən bir (ayda 8 dəfə)</span> irəli çəkilir.';

    const infoBox = document.getElementById('pricingInfoBox');
    infoBox.className = 'rounded-xl bg-gradient-to-r border p-4 mb-5 ' + (isPremium ? 'from-purple-50 to-indigo-50 border-purple-200/60' : 'from-amber-50 to-orange-50 border-amber-200/60');

    // Update desc
    document.getElementById('pricingModalDesc').textContent = isPremium
        ? 'Premium planlardan birini seçərək vakansiyanızı ön plana çıxarın'
        : 'İrəli çəkmə planları ilə vakansiyanızı daha çox insana çatdırın';

    // Pre-fill phone from currentUser if available
    const phoneInput = document.getElementById('pricingPhone');
    const phoneNote = document.getElementById('pricingPhoneNote');
    if (window.currentUser?.phone) {
        phoneInput.value = window.currentUser.phone;
        phoneNote.innerHTML = '<i class="fas fa-info-circle mr-0.5"></i> Profilinizdə qeyd edilmiş nömrə avtomatik əlavə olunub. İstəsəniz dəyişə bilərsiniz.';
    } else {
        phoneInput.value = '';
        phoneNote.innerHTML = '<i class="fas fa-info-circle mr-0.5"></i> Profilinizdə nömrə qeyd edilməyib. Zəhmət olmasa əlaqə nömrənizi daxil edin.';
    }

    // Show loading
    document.getElementById('pricingPlansContainer').innerHTML = `
        <div class="text-center py-8">
            <div class="w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto"></div>
            <p class="text-gray-400 text-sm mt-3">Planlar yüklənir...</p>
        </div>`;

    document.getElementById('pricingModal').classList.remove('hidden');
    document.body.classList.add('modal-open');

    // Click overlay to close
    setTimeout(() => {
        const overlay = document.getElementById('pricingModalOverlay');
        if (overlay) {
            overlay.onclick = closePricingModal;
        }
    }, 0);

    // Fetch plans
    await loadPricingPlans(type);
}

async function loadPricingPlans(type) {
    try {
        const { data } = await axios.get('/api/pricing/plans', {
            params: { type }
        });

        const container = document.getElementById('pricingPlansContainer');
        const isPremium = type === 'premium';

        if (!data || data.length === 0) {
            container.innerHTML = `<p class="text-sm text-gray-400 text-center py-4">Bu tip üçün plan mövcud deyil</p>`;
            return;
        }

        container.innerHTML = data.map((plan, index) => `
            <div data-plan-id="${plan._id}"
                 class="relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${index === 0 ? 'border-primary-500 bg-primary-50/30 ring-1 ring-primary-200' : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50/20'}">
                ${plan.duration === 'monthly' ? '<div class="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold">Ən çox seçilən</div>' : ''}
                <div class="flex items-center gap-4">
                    <div class="w-11 h-11 rounded-xl ${isPremium ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'} flex items-center justify-center text-lg flex-shrink-0">
                        <i class="fas ${isPremium ? 'fa-crown' : 'fa-rocket'}"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                            <p class="font-semibold text-gray-900 text-sm">${escapeHtml(plan.name)}</p>
                            <span class="text-[10px] font-medium px-1.5 py-0.5 rounded ${plan.duration === 'daily' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}">${plan.duration === 'daily' ? '1 gün' : '30 gün'}</span>
                        </div>
                        <div class="flex items-baseline gap-1 mt-1">
                            <span class="text-xl font-bold text-gray-900">${plan.price}</span>
                            <span class="text-xs text-gray-400">AZN</span>
                        </div>
                    </div>
                </div>
                ${plan.features && plan.features.length > 0 ? `
                <div class="mt-3 pt-3 border-t border-gray-100">
                    <ul class="space-y-1">
                        ${plan.features.slice(0, 3).map(f => `
                            <li class="flex items-start gap-1.5 text-xs text-gray-500">
                                <i class="fas fa-check text-emerald-500 mt-0.5 flex-shrink-0"></i>
                                <span>${escapeHtml(f)}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>` : `
                <div class="mt-3 pt-3 border-t border-gray-100">
                    <ul class="space-y-1">
                        <li class="flex items-start gap-1.5 text-xs text-gray-500">
                            <i class="fas fa-check text-emerald-500 mt-0.5 flex-shrink-0"></i>
                            <span>${isPremium ? 'Premium elanlar kateqoriyasında göstərilir' : 'Vakansiyalar siyahısında yuxarı qaldırılır'}</span>
                        </li>
                        <li class="flex items-start gap-1.5 text-xs text-gray-500">
                            <i class="fas fa-check text-emerald-500 mt-0.5 flex-shrink-0"></i>
                            <span>${plan.duration === 'monthly' ? (isPremium ? 'əsas səhifədə xüsusi bölmədə nümayiş' : 'Hər 4 gündən bir, ayda 8 dəfə irəli çəkilir') : (isPremium ? '"Premium" nişanı ilə qeyd olunur' : '1 gün müddətində irəli çəkilir')}</span>
                        </li>
                    </ul>
                </div>`}
            </div>
        `).join('');

        // Add click listeners to plan cards
        container.querySelectorAll('[data-plan-id]').forEach(card => {
            card.addEventListener('click', function () {
                selectPlan(this.dataset.planId, this);
            });
        });

        // Auto-select first plan
        if (data.length > 0 && container.firstElementChild) {
            selectPlan(data[0]._id, container.firstElementChild);
        }
    } catch (err) {
        document.getElementById('pricingPlansContainer').innerHTML =
            `<p class="text-sm text-red-400 text-center py-4">Planlar yüklənərkən xəta: ${err.message}</p>`;
    }
}

function selectPlan(planId, el) {
    selectedPlanId = planId;
    document.querySelectorAll('#pricingPlansContainer [data-plan-id]').forEach(card => {
        card.classList.remove('border-primary-500', 'bg-primary-50/30', 'ring-1', 'ring-primary-200');
        card.classList.add('border-gray-200');
    });
    if (el) {
        el.classList.remove('border-gray-200');
        el.classList.add('border-primary-500', 'bg-primary-50/30', 'ring-1', 'ring-primary-200');
    }
}

function closePricingModal() {
    document.getElementById('pricingModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
    const overlay = document.getElementById('pricingModalOverlay');
    if (overlay) overlay.onclick = null;
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
