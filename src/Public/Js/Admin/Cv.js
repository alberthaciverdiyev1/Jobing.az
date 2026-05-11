let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    loadCvs();
});

async function loadCvs(page = 1) {
    currentPage = page;
    const search = document.getElementById('searchInput')?.value || '';

    try {
        const params = { page, limit: 20 };
        if (search) params.search = search;

        const { data } = await axios.get('/api/admin/cvs', { params });
        renderCvsTable(data);
    } catch (err) {
        document.getElementById('cvsTableBody').innerHTML =
            `<tr><td colspan="7" class="px-5 py-8 text-center text-red-400">Error: ${err.message}</td></tr>`;
    }
}

function renderCvsTable(data) {
    const tbody = document.getElementById('cvsTableBody');

    if (!data.cvs || data.cvs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="px-5 py-8 text-center text-gray-400">No CVs found</td></tr>`;
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    tbody.innerHTML = data.cvs.map(cv => `
        <tr class="border-b hover:bg-gray-50 cursor-pointer" onclick="showCvDetail('${cv._id}')">
            <td class="px-5 py-3 font-medium text-gray-900">${escapeHtml(cv.fullName || 'Unnamed')}</td>
            <td class="px-5 py-3">${escapeHtml(cv.email || '-')}</td>
            <td class="px-5 py-3">${cv.phone || '-'}</td>
            <td class="px-5 py-3"><span class="badge ${cv.type === 'created' ? 'badge-blue' : 'badge-green'}">${cv.type || '-'}</span></td>
            <td class="px-5 py-3">${cv.userId ? escapeHtml(cv.userId.name || cv.userId.email || 'User') : 'Guest'}</td>
            <td class="px-5 py-3">${cv.createdAt ? new Date(cv.createdAt).toLocaleDateString() : '-'}</td>
            <td class="px-5 py-3" onclick="event.stopPropagation()">
                <button onclick="deleteCv('${cv._id}')" class="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
            </td>
        </tr>
    `).join('');

    document.getElementById('pagination').innerHTML = `
        <span class="text-sm text-gray-500">${data.total} total CVs</span>
        ${data.totalPages > 1 ? `
        <div class="flex gap-2">
            <button onclick="loadCvs(${data.page - 1})" class="px-3 py-1 text-sm ${data.page <= 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'} border rounded" ${data.page <= 1 ? 'disabled' : ''}>Prev</button>
            <button onclick="loadCvs(${data.page + 1})" class="px-3 py-1 text-sm ${data.page >= data.totalPages ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'} border rounded" ${data.page >= data.totalPages ? 'disabled' : ''}>Next</button>
        </div>` : ''}
    `;
}

async function showCvDetail(id) {
    try {
        const { data } = await axios.get(`/api/admin/cvs/${id}`);
        const content = document.getElementById('cvDetailContent');

        let skillsHtml = '';
        if (data.skills && data.skills.length > 0) {
            skillsHtml = data.skills.map(s => `<span class="badge badge-blue">${escapeHtml(s)}</span>`).join(' ');
        }

        let eduHtml = '';
        if (data.education && data.education.length > 0) {
            eduHtml = data.education.map(e => `
                <div class="text-sm">
                    <p class="font-medium">${escapeHtml(e.school || '')}${e.field ? ' - ' + escapeHtml(e.field) : ''}</p>
                    <p class="text-gray-500">${e.degree || ''}${e.startDate ? ' (' + e.startDate + (e.endDate ? ' - ' + e.endDate : '') + ')' : ''}</p>
                </div>
            `).join('');
        }

        let expHtml = '';
        if (data.experience && data.experience.length > 0) {
            expHtml = data.experience.map(e => `
                <div class="text-sm">
                    <p class="font-medium">${escapeHtml(e.position || '')} at ${escapeHtml(e.company || '')}</p>
                    <p class="text-gray-500">${e.startDate || ''}${e.endDate ? ' - ' + e.endDate : ''}</p>
                </div>
            `).join('');
        }

        content.innerHTML = `
            <div class="border-b pb-3 mb-3">
                <h3 class="text-lg font-semibold">${escapeHtml(data.fullName || 'Unnamed')}</h3>
                <p class="text-sm text-gray-500">${escapeHtml(data.email || '')} ${data.phone ? '| ' + data.phone : ''}</p>
                ${data.address ? `<p class="text-sm text-gray-500">${escapeHtml(data.address)}</p>` : ''}
            </div>
            ${data.summary ? `<div class="mb-3"><p class="text-xs text-gray-500 uppercase font-medium mb-1">Summary</p><p class="text-sm">${escapeHtml(data.summary)}</p></div>` : ''}
            ${skillsHtml ? `<div class="mb-3"><p class="text-xs text-gray-500 uppercase font-medium mb-1">Skills</p><div class="flex flex-wrap gap-1">${skillsHtml}</div></div>` : ''}
            ${eduHtml ? `<div class="mb-3"><p class="text-xs text-gray-500 uppercase font-medium mb-1">Education</p>${eduHtml}</div>` : ''}
            ${expHtml ? `<div class="mb-3"><p class="text-xs text-gray-500 uppercase font-medium mb-1">Experience</p>${expHtml}</div>` : ''}
            ${data.fileUrl ? `<div class="mt-3"><a href="${data.fileUrl}" target="_blank" class="text-indigo-600 hover:underline text-sm font-medium">View CV File</a></div>` : ''}
        `;
        document.getElementById('cvDetailModal').classList.remove('hidden');
        document.body.classList.add('modal-open');
    } catch (err) {
        alert('Error loading CV details: ' + err.message);
    }
}

function closeCvDetailModal() {
    document.getElementById('cvDetailModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

async function deleteCv(id) {
    if (!confirm('Are you sure you want to delete this CV?')) return;
    try {
        await axios.delete(`/api/admin/cvs/${id}`);
        loadCvs(currentPage);
    } catch (err) {
        alert('Error deleting CV: ' + err.message);
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
