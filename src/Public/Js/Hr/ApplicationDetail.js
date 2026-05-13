let currentApplicationId = null;
var acceptEditor = null;
var rejectEditor = null;
var interviewNotesEditor = null;

document.addEventListener('DOMContentLoaded', () => {
    var appId = window.location.pathname.split('/').pop();
    if (appId && appId.length === 24) {
        currentApplicationId = appId;
        loadApplicationDetail(appId);
    } else {
        // List view - handled by Application.js
    }
});

async function loadApplicationDetail(id) {
    try {
        var res = await axios.get('/api/hr/applications/' + id);
        var app = res.data;
        renderDetail(app);
    } catch (err) {
        document.getElementById('cvContent').innerHTML = '<p class="text-red-400">Error loading application: ' + err.message + '</p>';
    }
}

function renderDetail(app) {
    // Job info
    document.getElementById('appJobTitle').textContent = app.jobId ? escapeHtml(app.jobId.title) : '-';
    document.getElementById('appCompany').textContent = app.jobId ? escapeHtml(app.jobId.companyName || '') : escapeHtml(app.companyName || '');
    document.getElementById('appLocation').textContent = app.jobId ? escapeHtml(app.jobId.location || '-') : '-';

    // Status
    var statusEl = document.getElementById('appStatus');
    statusEl.textContent = app.status || 'pending';
    statusEl.className = 'text-sm font-medium ' + getStatusColor(app.status);
    document.getElementById('appDate').textContent = app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '-';

    // CV content
    renderCv(app.cvId);

    // User response
    if (app.userResponse && app.userResponse.message) {
        document.getElementById('userResponseSection').classList.remove('hidden');
        document.getElementById('userResponseText').textContent = app.userResponse.message;
    }

    // Actions
    if (app.status === 'pending' || app.status === 'interview') {
        document.getElementById('pendingActions').classList.remove('hidden');
        if (app.status === 'interview') {
            document.getElementById('interviewActions').classList.remove('hidden');
        }
    } else {
        document.getElementById('pendingActions').classList.add('hidden');
        document.getElementById('resolvedActions').classList.remove('hidden');
        if (app.companyResponse && app.companyResponse.reason) {
            document.getElementById('decisionReason').textContent = 'Reason: ' + app.companyResponse.reason;
        }
    }

    // Interview card
    if (app.interview && app.interview.scheduledAt) {
        document.getElementById('interviewCard').classList.remove('hidden');
        document.getElementById('interviewDate').textContent = new Date(app.interview.scheduledAt).toLocaleString();
        document.getElementById('interviewDuration').textContent = app.interview.duration || 30;
        document.getElementById('interviewLocation').textContent = app.interview.location || '-';
        document.getElementById('interviewNotes').textContent = app.interview.notes || '-';
        document.getElementById('interviewStatus').textContent = app.interview.status || 'pending';
    }
}

function renderCv(cv) {
    var container = document.getElementById('cvContent');
    if (!cv) {
        container.innerHTML = '<p class="text-gray-400">No CV attached</p>';
        return;
    }

    var html = '';
    if (cv.fullName) html += '<p><strong>Name:</strong> ' + escapeHtml(cv.fullName) + '</p>';
    if (cv.email) html += '<p><strong>Email:</strong> ' + escapeHtml(cv.email) + '</p>';
    if (cv.phone) html += '<p><strong>Phone:</strong> ' + escapeHtml(cv.phone) + '</p>';
    if (cv.summary) html += '<p><strong>Summary:</strong> ' + escapeHtml(cv.summary) + '</p>';

    if (cv.skills && cv.skills.length > 0) {
        html += '<div><strong>Skills:</strong><div class="flex flex-wrap gap-1 mt-1">';
        cv.skills.forEach(function(s) {
            html += '<span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">' + escapeHtml(s) + '</span>';
        });
        html += '</div></div>';
    }

    if (cv.experience && cv.experience.length > 0) {
        html += '<div><strong>Experience:</strong>';
        cv.experience.forEach(function(e) {
            html += '<div class="ml-2 mt-1 text-xs border-l-2 border-gray-200 pl-2">' +
                '<p class="font-medium">' + escapeHtml(e.position) + ' at ' + escapeHtml(e.company) + '</p>' +
                (e.startDate ? '<p class="text-gray-400">' + e.startDate + ' - ' + (e.endDate || 'Present') + '</p>' : '') +
                (e.description ? '<p>' + escapeHtml(e.description) + '</p>' : '') +
                '</div>';
        });
        html += '</div>';
    }

    if (cv.education && cv.education.length > 0) {
        html += '<div><strong>Education:</strong>';
        cv.education.forEach(function(e) {
            html += '<div class="ml-2 mt-1 text-xs">' +
                '<p class="font-medium">' + escapeHtml(e.degree || '') + ' in ' + escapeHtml(e.field || '') + '</p>' +
                '<p>' + escapeHtml(e.school || '') + '</p>' +
                '</div>';
        });
        html += '</div>';
    }

    if (cv.fileUrl) {
        html += '<p class="mt-2"><a href="' + cv.fileUrl + '" target="_blank" class="text-emerald-600 hover:underline text-xs">Download CV File</a></p>';
    }

    container.innerHTML = html || '<p class="text-gray-400">No CV details available</p>';
}

function getStatusColor(status) {
    switch (status) {
        case 'pending': return 'text-gray-600';
        case 'accepted': return 'text-green-600';
        case 'rejected': return 'text-red-600';
        case 'interview': return 'text-amber-600';
        default: return 'text-gray-600';
    }
}

// ============================================================
// MODAL ACTIONS
// ============================================================

function initModalEditor(id, existingEditor, callback) {
    var el = document.getElementById(id);
    if (!el || typeof ClassicEditor === 'undefined') {
        if (callback) callback(null);
        return;
    }
    if (existingEditor) {
        if (callback) callback(existingEditor);
        return;
    }
    var el = document.getElementById(id);
    ClassicEditor.create(el, {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', '|', 'undo', 'redo']
    }).then(function(editor) {
        if (callback) callback(editor);
    }).catch(function(err) {
        console.error('CKEditor error:', err);
        if (callback) callback(null);
    });
}

function showAcceptModal() {
    document.getElementById('acceptModal').classList.remove('hidden');
    initModalEditor('acceptReason', acceptEditor, function(editor) {
        acceptEditor = editor;
    });
}

async function confirmAccept() {
    if (!currentApplicationId) return;
    var reason = acceptEditor ? acceptEditor.getData() : document.getElementById('acceptReason').value;
    try {
        await axios.put('/api/hr/applications/' + currentApplicationId + '/status', { decision: 'accepted', reason: reason });
        alertify.success('Application accepted');
        if (acceptEditor) acceptEditor.setData('');
        closeModal('acceptModal');
        loadApplicationDetail(currentApplicationId);
    } catch (err) {
        alertify.error(err.response?.data?.error || err.message);
    }
}

function showRejectModal() {
    document.getElementById('rejectModal').classList.remove('hidden');
    initModalEditor('rejectReason', rejectEditor, function(editor) {
        rejectEditor = editor;
    });
}

async function confirmReject() {
    if (!currentApplicationId) return;
    var reason = rejectEditor ? rejectEditor.getData() : document.getElementById('rejectReason').value;
    try {
        await axios.put('/api/hr/applications/' + currentApplicationId + '/status', { decision: 'rejected', reason: reason });
        alertify.success('Application rejected');
        if (rejectEditor) rejectEditor.setData('');
        closeModal('rejectModal');
        loadApplicationDetail(currentApplicationId);
    } catch (err) {
        alertify.error(err.response?.data?.error || err.message);
    }
}

function showInterviewModal() {
    document.getElementById('interviewModal').classList.remove('hidden');
    initModalEditor('interviewNotesInput', interviewNotesEditor, function(editor) {
        interviewNotesEditor = editor;
    });
}

async function confirmInterview() {
    if (!currentApplicationId) return;
    var scheduledAt = document.getElementById('interviewScheduledAt').value;
    if (!scheduledAt) return alertify.error('Date & time is required');

    try {
        await axios.post('/api/hr/applications/' + currentApplicationId + '/interview', {
            scheduledAt: new Date(scheduledAt).toISOString(),
            duration: Number(document.getElementById('interviewDurationInput').value) || 30,
            location: document.getElementById('interviewLocationInput').value,
            notes: interviewNotesEditor ? interviewNotesEditor.getData() : document.getElementById('interviewNotesInput').value
        });
        alertify.success('Interview scheduled');
        if (interviewNotesEditor) interviewNotesEditor.setData('');
        closeModal('interviewModal');
        loadApplicationDetail(currentApplicationId);
    } catch (err) {
        alertify.error(err.response?.data?.error || err.message);
    }
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

function escapeHtml(text) {
    if (!text) return '';
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}
