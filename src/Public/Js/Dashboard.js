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

    // ============================================
    // LOAD USER APPLICATIONS
    // ============================================
    loadUserApplications();
});

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

        html += '<div class="flex items-center justify-between p-5 sm:px-6 hover:bg-gray-50/50 transition-colors">' +
            '<div class="min-w-0">' +
            '<p class="font-semibold text-gray-900 text-sm truncate">' + jobTitle + '</p>' +
            '<p class="text-xs text-gray-400">' + companyName + ' • ' + appliedDate + '</p>';

        // Show company response
        if (a.companyResponse && a.companyResponse.decision) {
            var respText = escapeHtml(a.companyResponse.reason || '');
            if (respText) {
                html += '<p class="text-xs text-gray-500 mt-1">Cavab: ' + respText + '</p>';
            }
            // Show respond link if user hasn't responded and has a decision
            if (!a.userResponse || !a.userResponse.respondedAt) {
                html += '<button onclick="showUserRespondModal(\'' + a._id + '\')" class="text-xs text-primary-500 hover:text-primary-700 mt-1">Cavabla</button>';
            }
        }

        // Show interview info
        if (a.interview && a.interview.scheduledAt) {
            var intDate = new Date(a.interview.scheduledAt).toLocaleString('az-AZ');
            html += '<p class="text-xs text-amber-600 mt-1"><i class="fas fa-calendar"></i> Müsahibə: ' + intDate + '</p>';
        }

        html += '</div>' +
            '<div class="flex-shrink-0">' + statusBadge + '</div>' +
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

function showUserRespondModal(applicationId) {
    alertify.prompt(
        'Cavabınız',
        'Şirkətin qərarına cavabınızı yazın',
        '',
        async function(evt, value) {
            try {
                await axios.put('/api/applications/' + applicationId + '/respond', { message: value || '' });
                alertify.success('Cavabınız göndərildi');
                loadUserApplications();
            } catch (err) {
                alertify.error(err.response?.data?.error || 'Xəta baş verdi');
            }
        },
        function() {}
    ).set('labels', { ok: 'Göndər', cancel: 'İmtina' });
}

function escapeHtml(text) {
    if (!text) return '';
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}
