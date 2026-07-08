var currentPage = 1;

document.addEventListener('DOMContentLoaded', function() {
    loadJobSeekers();
    document.getElementById('searchInput')?.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') loadJobSeekers();
    });
});

function loadJobSeekers(page) {
    if (page !== undefined) currentPage = page;
    var search = document.getElementById('searchInput')?.value || '';
    var status = document.getElementById('statusFilter')?.value || 'all';

    axios.get('/api/admin/job-seekers', { params: { page: currentPage, limit: 20, search: search, status: status } })
        .then(function(res) { renderTable(res.data); })
        .catch(function(err) {
            document.getElementById('jobSeekersTableBody').innerHTML =
                '<tr><td colspan="7" class="px-5 py-8 text-center text-red-400">Xəta: ' + err.message + '</td></tr>';
        });
}

function renderTable(data) {
    var tbody = document.getElementById('jobSeekersTableBody');
    if (!tbody) return;

    if (!data.jobs || data.jobs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="px-5 py-8 text-center text-gray-400">Heç bir elan tapılmadı</td></tr>';
        var p = document.getElementById('pagination');
        if (p) p.innerHTML = '';
        return;
    }

    tbody.innerHTML = data.jobs.map(function(job) {
        var statusBadge = job.isActive
            ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Aktiv</span>'
            : '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Gözləmədə</span>';
        return '<tr class="border-b hover:bg-gray-50">' +
            '<td class="px-5 py-3 font-medium text-gray-900">' + escapeHtml(job.title || '-') + '</td>' +
            '<td class="px-5 py-3">' + escapeHtml(job.userName || '-') + '</td>' +
            '<td class="px-5 py-3">' + escapeHtml(job.email || '-') + '</td>' +
            '<td class="px-5 py-3">' + (job.phone || '-') + '</td>' +
            '<td class="px-5 py-3">' + statusBadge + '</td>' +
            '<td class="px-5 py-3">' + (job.createdAt ? new Date(job.createdAt).toLocaleDateString('az-AZ') : '-') + '</td>' +
            '<td class="px-5 py-3">' +
            '<button onclick="toggleActive(\'' + job._id + '\', ' + job.isActive + ')" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium mr-3">' + (job.isActive ? 'Deaktiv et' : 'Aktiv et') + '</button>' +
            '<button onclick="deleteJobSeeker(\'' + job._id + '\')" class="text-red-600 hover:text-red-800 text-sm font-medium">Sil</button>' +
            '</td></tr>';
    }).join('');

    renderPagination(data);
}

function renderPagination(data) {
    var pagination = document.getElementById('pagination');
    if (!pagination) return;
    if (data.totalPages <= 1) {
        pagination.innerHTML = '<span class="text-sm text-gray-500">Cəmi ' + data.total + ' elan</span>';
        return;
    }
    pagination.innerHTML =
        '<span class="text-sm text-gray-500">Səhifə ' + data.page + ' / ' + data.totalPages + ' (' + data.total + ' cəmi)</span>' +
        '<div class="flex gap-2">' +
        '<button onclick="loadJobSeekers(' + (data.page - 1) + ')" class="px-3 py-1 text-sm border rounded ' + (data.page <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100') + '" ' + (data.page <= 1 ? 'disabled' : '') + '>Əvvəl</button>' +
        '<button onclick="loadJobSeekers(' + (data.page + 1) + ')" class="px-3 py-1 text-sm border rounded ' + (data.page >= data.totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100') + '" ' + (data.page >= data.totalPages ? 'disabled' : '') + '>Sonra</button>' +
        '</div>';
}

function toggleActive(id, currentActive) {
    var action = currentActive ? 'deaktiv etmək' : 'aktiv etmək';
    if (!confirm('Bu elanı ' + action + ' istədiyinizə əminsiniz?')) return;
    axios.patch('/api/admin/job-seekers/' + id + '/toggle')
        .then(function(res) {
            loadJobSeekers();
        })
        .catch(function(err) {
            alert('Xəta: ' + (err.response?.data?.error || err.message));
        });
}

function deleteJobSeeker(id) {
    if (!confirm('Bu elanı silmək istədiyinizə əminsiniz?')) return;
    axios.delete('/api/admin/job-seekers/' + id)
        .then(function() { loadJobSeekers(); })
        .catch(function(err) { alert('Xəta: ' + (err.response?.data?.error || err.message)); });
}

function escapeHtml(text) {
    if (!text && text !== 0) return '';
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}
