document.addEventListener('DOMContentLoaded', () => {
    loadInterviews();
});

async function loadInterviews() {
    try {
        var res = await axios.get('/api/hr/applications', { params: { limit: 100 } });
        var applications = res.data.applications || [];

        var withInterviews = applications.filter(function(a) {
            return a.interview && a.interview.scheduledAt;
        });

        renderInterviews(withInterviews);
        updateStats(withInterviews);
    } catch (err) {
        var tbody = document.getElementById('interviewsTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="px-5 py-8 text-center text-red-400">Error: ' + err.message + '</td></tr>';
    }
}

function updateStats(interviews) {
    var pending = 0, confirmed = 0, cancelled = 0;
    interviews.forEach(function(a) {
        var status = a.interview.status || 'pending';
        if (status === 'pending') pending++;
        else if (status === 'confirmed') confirmed++;
        else cancelled++;
    });
    document.getElementById('statPending').textContent = pending;
    document.getElementById('statConfirmed').textContent = confirmed;
    document.getElementById('statCancelled').textContent = cancelled;
}

function renderInterviews(interviews) {
    var tbody = document.getElementById('interviewsTableBody');
    if (!tbody) return;

    if (interviews.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="px-5 py-8 text-center text-gray-400">No interviews found</td></tr>';
        return;
    }

    tbody.innerHTML = interviews.map(function(a) {
        var userName = a.userId ? (a.userId.name + ' ' + (a.userId.surname || '')).trim() : 'Unknown';
        var jobTitle = a.jobId ? escapeHtml(a.jobId.title) : '-';
        var intDate = a.interview.scheduledAt ? new Date(a.interview.scheduledAt).toLocaleString() : '-';
        var location = escapeHtml(a.interview.location || '-');
        var status = a.interview.status || 'pending';
        var statusBadge = getInterviewStatusBadge(status);

        return '<tr class="border-b hover:bg-gray-50">' +
            '<td class="px-5 py-3 font-medium">' + escapeHtml(userName) + '</td>' +
            '<td class="px-5 py-3 text-sm text-gray-500">' + jobTitle + '</td>' +
            '<td class="px-5 py-3 text-sm text-gray-500">' + intDate + '</td>' +
            '<td class="px-5 py-3 text-sm text-gray-500">' + location + '</td>' +
            '<td class="px-5 py-3">' + statusBadge + '</td>' +
            '<td class="px-5 py-3 text-right">' +
            '<a href="/hr/applications/' + a._id + '" class="px-3 py-1 text-xs text-emerald-600 hover:bg-emerald-50 rounded border border-emerald-200">View</a>' +
            '</td>' +
            '</tr>';
    }).join('');
}

function getInterviewStatusBadge(status) {
    var map = {
        'pending': 'bg-amber-100 text-amber-700',
        'confirmed': 'bg-emerald-100 text-emerald-700',
        'cancelled': 'bg-red-100 text-red-700',
        'rescheduled': 'bg-blue-100 text-blue-700'
    };
    var cls = map[status] || 'bg-gray-100 text-gray-700';
    return '<span class="px-2 py-1 text-xs rounded-full ' + cls + '">' + status + '</span>';
}

function escapeHtml(text) {
    if (!text) return '';
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}
