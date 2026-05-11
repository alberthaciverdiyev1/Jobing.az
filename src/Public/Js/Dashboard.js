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
                            const item = this.closest('[class*="flex items-center justify-between"]');
                            if (item) {
                                item.style.transition = 'all 0.3s ease';
                                item.style.opacity = '0';
                                item.style.transform = 'translateX(20px)';
                                setTimeout(() => item.remove(), 300);
                            }
                            setTimeout(() => window.location.reload(), 500);
                        }
                    } catch (err) {
                        alertify.error(err.response?.data?.error || 'Xəta baş verdi');
                    }
                },
                () => {}
            ).set('labels', { ok: 'Sil', cancel: 'İmtina' });
        });
    });

    // ============================================
    // LOAD USER APPLICATIONS
    // ============================================
    loadUserApplications();
});

// ============================================
// RESPOND MODAL
// ============================================
function showUserRespondModal(applicationId) {
    document.getElementById('respondApplicationId').value = applicationId;
    document.getElementById('respondMessage').value = '';
    document.getElementById('userRespondModal').classList.remove('hidden');
    document.body.classList.add('modal-open');
}

function closeRespondModal() {
    document.getElementById('userRespondModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

async function submitUserRespond() {
    const id = document.getElementById('respondApplicationId').value;
    const message = document.getElementById('respondMessage').value.trim();
    if (!id) return;

    try {
        await axios.put('/api/applications/' + id + '/respond', { message });
        alertify.success('Cavabınız göndərildi');
        closeRespondModal();
        loadUserApplications();
    } catch (err) {
        alertify.error(err.response?.data?.error || 'Xəta baş verdi');
    }
}

// ============================================
// LOAD APPLICATIONS
// ============================================
async function loadUserApplications() {
    var container = document.getElementById('user-applications');
    if (!container) return;

    try {
        var res = await axios.get('/api/applications');
        var applications = res.data.applications || [];
        renderApplications(applications);
    } catch (err) {
        container.innerHTML = '<div class="text-center py-8"><p class="text-gray-400 text-sm">Müraciətlər yüklənə bilmədi</p></div>';
    }
}

function renderApplications(applications) {
    var container = document.getElementById('user-applications');
    if (!container) return;

    if (applications.length === 0) {
        container.innerHTML = '<div class="text-center py-8">' +
            '<div class="w-10 h-10 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3"><i class="fas fa-inbox text-gray-400"></i></div>' +
            '<p class="text-gray-500 text-sm">Hələ müraciətiniz yoxdur</p>' +
            '</div>';
        return;
    }

    var html = '<div class="divide-y divide-gray-50">';
    applications.forEach(function(a) {
        var jobTitle = a.jobId ? escapeHtml(a.jobId.title) : '-';
        var companyName = a.jobId ? escapeHtml(a.jobId.companyName || '') : '';
        var statusBadge = getUserStatusBadge(a.status);
        var appliedDate = a.createdAt ? new Date(a.createdAt).toLocaleDateString('az-AZ') : '-';

        html += '<div class="p-5 sm:px-6 hover:bg-gray-50/50 transition-colors">' +
            '<div class="flex items-center justify-between">' +
            '<div class="min-w-0 flex-1">' +
            '<p class="font-semibold text-gray-900 text-sm truncate">' + jobTitle + '</p>' +
            '<p class="text-xs text-gray-400">' + companyName + ' • ' + appliedDate + '</p>';

        // Show company response (for accepted, rejected, or interview)
        if (a.companyResponse && a.companyResponse.decision) {
            var decisionLabel = a.companyResponse.decision === 'rejected' ? 'Rədd edildi' : 'Qəbul edildi';
            var respText = a.companyResponse.reason ? escapeHtml(a.companyResponse.reason) : '';
            html += '<div class="mt-2 p-2.5 rounded-lg ' + (a.companyResponse.decision === 'rejected' ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100') + '">' +
                '<p class="text-xs font-medium ' + (a.companyResponse.decision === 'rejected' ? 'text-red-600' : 'text-green-600') + '">' + decisionLabel + '</p>' +
                (respText ? '<p class="text-xs text-gray-600 mt-0.5">' + respText + '</p>' : '') +
                '</div>';

            // Show respond button if user hasn't responded yet
            if (!a.userResponse || !a.userResponse.respondedAt) {
                html += '<button onclick="showUserRespondModal(\'' + a._id + '\')" class="text-xs text-primary-500 hover:text-primary-700 mt-1.5 font-medium">Cavabla</button>';
            }
        }

        // Show user's own response after they've responded
        if (a.userResponse && a.userResponse.respondedAt) {
            var userMsg = a.userResponse.message ? escapeHtml(a.userResponse.message) : '';
            html += '<div class="mt-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100">' +
                '<p class="text-xs font-medium text-gray-500">Sizin cavabınız</p>' +
                (userMsg ? '<p class="text-xs text-gray-700 mt-0.5">' + userMsg + '</p>' : '<p class="text-xs text-gray-400 mt-0.5 italic">Cavab göndərildi</p>') +
                '</div>';
        }

        // Show interview info
        if (a.interview && a.interview.scheduledAt) {
            var intDate = new Date(a.interview.scheduledAt).toLocaleString('az-AZ');
            html += '<div class="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-100">' +
                '<p class="text-xs font-medium text-amber-600"><i class="fas fa-calendar mr-1"></i>Müsahibə təyin edildi</p>' +
                '<p class="text-xs text-gray-600 mt-0.5">' + intDate + '</p>' +
                '</div>';
        }

        html += '</div>' +
            '<div class="flex-shrink-0 ml-3">' + statusBadge + '</div>' +
            '</div>' +
            '</div>';
    });
    html += '</div>';

    container.innerHTML = html;
}

function getUserStatusBadge(status) {
    var map = {
        'pending': 'bg-gray-100 text-gray-700',
        'accepted': 'bg-green-100 text-green-700',
        'rejected': 'bg-red-100 text-red-700',
        'interview': 'bg-amber-100 text-amber-700'
    };
    var cls = map[status] || 'bg-gray-100 text-gray-700';
    var labels = {
        'pending': 'Gözləmədə',
        'accepted': 'Qəbul edildi',
        'rejected': 'Rədd edildi',
        'interview': 'Müsahibə'
    };
    return '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ' + cls + '">' + (labels[status] || status) + '</span>';
}

function escapeHtml(text) {
    if (!text) return '';
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}

