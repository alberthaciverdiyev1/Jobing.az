var currentPage = 1;

document.addEventListener('DOMContentLoaded', function() {
    loadCvs();
    var searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') loadCvs();
        });
    }
});

function loadCvs(page) {
    if (page !== undefined) currentPage = page;
    var search = document.getElementById('searchInput') ? document.getElementById('searchInput').value : '';

    axios.get('/api/admin/cvs', { params: { page: currentPage, limit: 20, search: search } })
        .then(function(res) { renderCvsTable(res.data); })
        .catch(function(err) {
            document.getElementById('cvsTableBody').innerHTML =
                '<tr><td colspan="7" class="px-5 py-8 text-center text-red-400">Error: ' + err.message + '</td></tr>';
        });
}

function renderCvsTable(data) {
    var tbody = document.getElementById('cvsTableBody');
    if (!tbody) return;

    if (!data.cvs || data.cvs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="px-5 py-8 text-center text-gray-400">No CVs found</td></tr>';
        var p = document.getElementById('pagination');
        if (p) p.innerHTML = '';
        return;
    }

    tbody.innerHTML = data.cvs.map(function(cv) {
        var userName = 'Guest';
        if (cv.userId) {
            userName = cv.userId.name || cv.userId.email || 'User';
        }
        var truncated = (cv.fullName || 'Unnamed').length > 25
            ? cv.fullName.substring(0, 25) + '...'
            : (cv.fullName || 'Unnamed');
        return '<tr class="border-b hover:bg-gray-50 cursor-pointer" onclick="showCvDetail(\'' + cv._id + '\')">' +
            '<td class="px-5 py-3 font-medium text-gray-900" title="' + escapeHtml(cv.fullName || 'Unnamed') + '">' + escapeHtml(truncated) + '</td>' +
            '<td class="px-5 py-3">' + escapeHtml(cv.email || '-') + '</td>' +
            '<td class="px-5 py-3">' + (cv.phone || '-') + '</td>' +
            '<td class="px-5 py-3"><span class="badge ' + (cv.type === 'created' ? 'badge-blue' : 'badge-green') + '">' + (cv.type || '-') + '</span></td>' +
            '<td class="px-5 py-3">' + escapeHtml(userName) + '</td>' +
            '<td class="px-5 py-3">' + (cv.createdAt ? new Date(cv.createdAt).toLocaleDateString() : '-') + '</td>' +
            '<td class="px-5 py-3" onclick="event.stopPropagation()">' +
            '<button onclick="deleteCv(\'' + cv._id + '\')" class="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>' +
            '</td></tr>';
    }).join('');

    renderPaginationCv(data);
}

function renderPaginationCv(data) {
    var pagination = document.getElementById('pagination');
    if (!pagination) return;
    if (data.totalPages <= 1) {
        pagination.innerHTML = '<span class="text-sm text-gray-500">' + data.total + ' total CVs</span>';
        return;
    }
    pagination.innerHTML =
        '<span class="text-sm text-gray-500">Page ' + data.page + ' of ' + data.totalPages + ' (' + data.total + ' total)</span>' +
        '<div class="flex gap-2">' +
        '<button onclick="loadCvs(' + (data.page - 1) + ')" class="px-3 py-1 text-sm border rounded ' + (data.page <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100') + '" ' + (data.page <= 1 ? 'disabled' : '') + '>Prev</button>' +
        '<button onclick="loadCvs(' + (data.page + 1) + ')" class="px-3 py-1 text-sm border rounded ' + (data.page >= data.totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100') + '" ' + (data.page >= data.totalPages ? 'disabled' : '') + '>Next</button>' +
        '</div>';
}

function showCvDetail(id) {
    axios.get('/api/admin/cvs/' + id)
        .then(function(res) {
            var data = res.data;
            var content = document.getElementById('cvDetailContent');
            if (!content) return;

            var skillsHtml = '';
            if (data.skills && data.skills.length > 0) {
                skillsHtml = data.skills.map(function(s) { return '<span class="badge badge-blue">' + escapeHtml(s) + '</span>'; }).join(' ');
            }

            var eduHtml = '';
            if (data.education && data.education.length > 0) {
                eduHtml = '<div class="text-xs text-gray-500 uppercase font-medium mb-1 mt-3">Education</div>';
                data.education.forEach(function(e) {
                    eduHtml += '<div class="text-sm mb-1">' +
                        '<span class="font-medium">' + escapeHtml(e.school || '') + '</span>' +
                        (e.field ? ' - ' + escapeHtml(e.field) : '') +
                        (e.degree ? ' (' + escapeHtml(e.degree) + ')' : '') +
                        '</div>';
                });
            }

            var expHtml = '';
            if (data.experience && data.experience.length > 0) {
                expHtml = '<div class="text-xs text-gray-500 uppercase font-medium mb-1 mt-3">Experience</div>';
                data.experience.forEach(function(e) {
                    expHtml += '<div class="text-sm mb-1">' +
                        '<span class="font-medium">' + escapeHtml(e.position || '') + '</span>' +
                        (e.company ? ' at ' + escapeHtml(e.company) : '') +
                        '</div>';
                });
            }

            content.innerHTML =
                '<div class="border-b pb-3 mb-3">' +
                '<h3 class="text-lg font-semibold">' + escapeHtml(data.fullName || 'Unnamed') + '</h3>' +
                '<p class="text-sm text-gray-500">' + escapeHtml(data.email || '') + (data.phone ? ' | ' + escapeHtml(data.phone) : '') + '</p>' +
                (data.address ? '<p class="text-sm text-gray-500">' + escapeHtml(data.address) + '</p>' : '') +
                '</div>' +
                (data.summary ? '<div class="mb-3"><p class="text-xs text-gray-500 uppercase font-medium mb-1">Summary</p><p class="text-sm">' + escapeHtml(data.summary) + '</p></div>' : '') +
                (skillsHtml ? '<div class="mb-3"><p class="text-xs text-gray-500 uppercase font-medium mb-1">Skills</p><div class="flex flex-wrap gap-1">' + skillsHtml + '</div></div>' : '') +
                eduHtml +
                expHtml +
                (data.fileUrl ? '<div class="mt-4"><a href="' + data.fileUrl + '" target="_blank" class="inline-flex items-center px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">View CV File</a></div>' : '');

            document.getElementById('cvDetailModal').classList.remove('hidden');
            document.body.classList.add('modal-open');
        })
        .catch(function(err) {
            alert('Error loading CV details: ' + err.message);
        });
}

function closeCvDetailModal() {
    document.getElementById('cvDetailModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

function deleteCv(id) {
    if (!confirm('Are you sure you want to delete this CV?')) return;
    axios.delete('/api/admin/cvs/' + id)
        .then(function() { loadCvs(); })
        .catch(function(err) { alert('Error deleting CV: ' + err.message); });
}

function escapeHtml(text) {
    if (!text && text !== 0) return '';
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}
