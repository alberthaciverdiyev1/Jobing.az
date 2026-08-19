let currentPage = 1;
let editingCompanyId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadCompanies();
    document.getElementById('companyForm').addEventListener('submit', handleCompanySubmit);
});

async function loadCompanies(page = 1) {
    currentPage = page;
    const search = document.getElementById('searchInput')?.value || '';

    try {
        const params = { page, limit: 20 };
        if (search) params.search = search;

        const { data } = await axios.get('/api/admin/companies', { params });
        renderCompaniesTable(data);
    } catch (err) {
        document.getElementById('companiesTableBody').innerHTML =
            `<tr><td colspan="4" class="px-5 py-8 text-center text-red-400">Error: ${err.message}</td></tr>`;
    }
}

function renderCompaniesTable(data) {
    const tbody = document.getElementById('companiesTableBody');

    if (!data.companies || data.companies.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="px-5 py-8 text-center text-gray-400">No companies found</td></tr>`;
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    tbody.innerHTML = data.companies.map(c => `
        <tr class="border-b hover:bg-gray-50">
            <td class="px-5 py-3">
                ${c.imageUrl
                    ? `<img src="${c.imageUrl}" alt="${c.companyName}" class="w-10 h-10 rounded-full object-cover">`
                    : `<div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">${(c.companyName || '?').charAt(0)}</div>`}
            </td>
            <td class="px-5 py-3 font-medium text-gray-900">${escapeHtml(c.companyName)}</td>
            <td class="px-5 py-3">${c.website ? `<a href="${c.website}" target="_blank" class="text-indigo-600 hover:underline text-sm">${c.website}</a>` : '-'}</td>
            <td class="px-5 py-3">
                <div class="flex items-center gap-2">
                    <button onclick="showCompanyDetail('${c._id}')" class="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                    <button onclick="editCompany('${c._id}')" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Edit</button>
                    <button onclick="deleteCompany('${c._id}')" class="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');

    document.getElementById('pagination').innerHTML = `
        <span class="text-sm text-gray-500">${data.total} total companies</span>
        ${data.totalPages > 1 ? `
        <div class="flex gap-2">
            <button onclick="loadCompanies(${data.page - 1})" class="px-3 py-1 text-sm ${data.page <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'} border rounded" ${data.page <= 1 ? 'disabled' : ''}>Prev</button>
            <button onclick="loadCompanies(${data.page + 1})" class="px-3 py-1 text-sm ${data.page >= data.totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'} border rounded" ${data.page >= data.totalPages ? 'disabled' : ''}>Next</button>
        </div>` : ''}
    `;
}

function openCompanyModal() {
    editingCompanyId = null;
    document.getElementById('companyForm').reset();
    document.getElementById('companyId').value = '';
    document.getElementById('companyModalTitle').textContent = 'Add Company';
    document.getElementById('companyModal').classList.remove('hidden');
    document.body.classList.add('modal-open');
}

function closeCompanyModal() {
    document.getElementById('companyModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

async function editCompany(id) {
    try {
        const { data } = await axios.get(`/api/admin/companies/${id}`);
        editingCompanyId = id;
        document.getElementById('companyModalTitle').textContent = 'Edit Company';
        document.getElementById('companyId').value = id;
        document.getElementById('companyName').value = data.companyName || '';
        document.getElementById('companyWebsite').value = data.website || '';
        document.getElementById('companyImageUrl').value = data.imageUrl || '';
        document.getElementById('companyModal').classList.remove('hidden');
        document.body.classList.add('modal-open');
    } catch (err) {
        alert('Error loading company: ' + err.message);
    }
}

async function deleteCompany(id) {
    if (!confirm('Are you sure you want to delete this company?')) return;
    try {
        await axios.delete(`/api/admin/companies/${id}`);
        loadCompanies(currentPage);
    } catch (err) {
        alert('Error deleting company: ' + err.message);
    }
}

// ========== Company Detail with Vacancies ==========

async function showCompanyDetail(id) {
    try {
        const { data } = await axios.get(`/api/admin/companies/${id}`);
        const content = document.getElementById('companyDetailContent');

        var jobsHtml = '';
        if (data.jobs && data.jobs.length > 0) {
            jobsHtml = '<div class="mt-3 pt-3 border-t"><p class="text-xs text-gray-500 uppercase font-medium mb-2">Vacancies (' + data.jobs.length + ')</p><div class="space-y-2 max-h-64 overflow-y-auto">';
            data.jobs.forEach(function(job) {
                var badgeClass = job.isActive ? 'badge-green' : 'badge-red';
                var badgeLabel = job.isActive ? 'Active' : 'Inactive';
                jobsHtml += '<div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">' +
                    '<span class="font-medium text-gray-800 truncate max-w-xs">' + escapeHtml(job.title) + '</span>' +
                    '<span class="badge ' + badgeClass + ' flex-shrink-0">' + badgeLabel + '</span>' +
                    '</div>';
            });
            jobsHtml += '</div></div>';
        } else {
            jobsHtml = '<div class="mt-3 pt-3 border-t text-sm text-gray-400">No vacancies found</div>';
        }

        content.innerHTML =
            '<div class="flex items-center gap-3 pb-3 border-b">' +
                (data.imageUrl
                    ? '<img src="' + data.imageUrl + '" alt="' + escapeHtml(data.companyName) + '" class="w-14 h-14 rounded-lg object-cover">'
                    : '<div class="w-14 h-14 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">' + (data.companyName || '?').charAt(0) + '</div>') +
                '<div>' +
                    '<h3 class="text-lg font-semibold text-gray-900">' + escapeHtml(data.companyName) + '</h3>' +
                    (data.website ? '<a href="' + data.website + '" target="_blank" class="text-sm text-indigo-600 hover:underline">' + data.website + '</a>' : '') +
                    '<p class="text-sm text-gray-500">' + (data.jobCount || 0) + ' total vacancies</p>' +
                '</div>' +
            '</div>' +
            jobsHtml;

        document.getElementById('companyDetailModal').classList.remove('hidden');
        document.body.classList.add('modal-open');
    } catch (err) {
        alert('Error loading company details: ' + err.message);
    }
}

function closeCompanyDetail() {
    document.getElementById('companyDetailModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

async function handleCompanySubmit(e) {
    e.preventDefault();
    const payload = {
        companyName: document.getElementById('companyName').value,
        website: document.getElementById('companyWebsite').value,
        imageUrl: document.getElementById('companyImageUrl').value
    };

    try {
        if (editingCompanyId) {
            await axios.put(`/api/admin/companies/${editingCompanyId}`, payload);
        } else {
            await axios.post('/api/admin/companies', payload);
        }
        closeCompanyModal();
        loadCompanies(currentPage);
    } catch (err) {
        alert('Error saving company: ' + err.message);
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
