let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    loadJobsFilter();
    loadApplications();
});

async function loadJobsFilter() {
    try {
        var res = await axios.get('/api/hr/jobs', { params: { limit: 100 } });
        var jobs = res.data.jobs || [];
        var sel = document.getElementById('jobFilter');
        if (sel) {
            jobs.forEach(function(j) {
                sel.innerHTML += '<option value="' + j._id + '">' + escapeHtml(j.title) + ' - ' + escapeHtml(j.companyName || '') + '</option>';
            });
        }
    } catch (err) { console.error(err); }
}

function loadApplications(page) {
    if (page !== undefined) currentPage = page;

    var params = {
        page: currentPage,
        limit: 20,
        status: document.getElementById('statusFilter')?.value || undefined,
        jobId: document.getElementById('jobFilter')?.value || undefined
    };

    axios.get('/api/hr/applications', { params: params })
        .then(function(res) { renderApplications(res.data); })
        .catch(function(err) {
            var tbody = document.getElementById('applicationsTableBody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="px-5 py-8 text-center text-red-400">Error: ' + err.message + '</td></tr>';
        });
}

function renderApplications(data) {
    var tbody = document.getElementById('applicationsTableBody');
    if (!tbody) return;

    if (!data.applications || data.applications.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="px-5 py-8 text-center text-gray-400">No applications found</td></tr>';
        var pag = document.getElementById('pagination');
        if (pag) pag.innerHTML = '';
        return;
    }

    tbody.innerHTML = data.applications.map(function(a) {
        var userName = a.userId ? (a.userId.name + ' ' + (a.userId.surname || '')).trim() : 'Unknown';
        var jobTitle = a.jobId ? escapeHtml(a.jobId.title) : '-';
        var companyName = a.jobId ? escapeHtml(a.jobId.companyName || '') : escapeHtml(a.companyName || '');
        var statusBadge = getStatusBadge(a.status);
        var appliedDate = a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '-';

        return '<tr class="border-b hover:bg-gray-50">' +
            '<td class="px-5 py-3 font-medium">' + escapeHtml(userName) + '</td>' +
            '<td class="px-5 py-3 text-sm text-gray-500">' + jobTitle + '</td>' +
            '<td class="px-5 py-3 text-sm text-gray-500">' + companyName + '</td>' +
            '<td class="px-5 py-3">' + statusBadge + '</td>' +
            '<td class="px-5 py-3 text-sm text-gray-500">' + appliedDate + '</td>' +
            '<td class="px-5 py-3 text-right">' +
            '<a href="/hr/applications/' + a._id + '" class="px-3 py-1 text-xs text-emerald-600 hover:bg-emerald-50 rounded border border-emerald-200">View</a>' +
            '</td>' +
            '</tr>';
    }).join('');

    renderPagination(data);
}

function getStatusBadge(status) {
    var map = {
        'pending': 'bg-gray-100 text-gray-700',
        'accepted': 'bg-green-100 text-green-700',
        'rejected': 'bg-red-100 text-red-700',
        'interview': 'bg-amber-100 text-amber-700'
    };
    var cls = map[status] || 'bg-gray-100 text-gray-700';
    return '<span class="px-2 py-1 text-xs rounded-full ' + cls + '">' + (status || 'pending') + '</span>';
}

function renderPagination(data) {
    var pag = document.getElementById('pagination');
    if (!pag) return;
    if (data.totalPages <= 1) {
        pag.innerHTML = '<span class="text-sm text-gray-500">' + (data.total || 0) + ' applications</span>';
    } else {
        pag.innerHTML =
            '<span class="text-sm text-gray-500">Page ' + data.page + ' of ' + data.totalPages + '</span>' +
            '<div class="flex gap-2">' +
            '<button onclick="loadApplications(' + (data.page - 1) + ')" class="px-3 py-1 text-sm border rounded ' + (data.page <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100') + '" ' + (data.page <= 1 ? 'disabled' : '') + '>Prev</button>' +
            '<button onclick="loadApplications(' + (data.page + 1) + ')" class="px-3 py-1 text-sm border rounded ' + (data.page >= data.totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100') + '" ' + (data.page >= data.totalPages ? 'disabled' : '') + '>Next</button>' +
            '</div>';
    }
}

function escapeHtml(text) {
    if (!text) return '';
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}
