let currentPage = 1;
let editingJobId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadJobs();
    document.getElementById('jobForm').addEventListener('submit', handleJobSubmit);
});

async function loadJobs(page = 1) {
    currentPage = page;
    const search = document.getElementById('searchInput')?.value || '';
    const isActive = document.getElementById('statusFilter')?.value || '';

    try {
        const params = { page, limit: 20 };
        if (search) params.search = search;
        if (isActive) params.isActive = isActive;

        const { data } = await axios.get('/api/admin/jobs', { params });
        renderJobsTable(data);
    } catch (err) {
        document.getElementById('jobsTableBody').innerHTML =
            `<tr><td colspan="7" class="px-5 py-8 text-center text-red-400">Error loading jobs: ${err.message}</td></tr>`;
    }
}

function renderJobsTable(data) {
    const tbody = document.getElementById('jobsTableBody');

    if (!data.jobs || data.jobs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="px-5 py-8 text-center text-gray-400">No jobs found</td></tr>`;
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    tbody.innerHTML = data.jobs.map(job => `
        <tr class="border-b hover:bg-gray-50">
            <td class="px-5 py-3 font-medium text-gray-900 max-w-xs truncate" title="${escapeHtml(job.title)}">${escapeHtml(job.title)}</td>
            <td class="px-5 py-3">${escapeHtml(job.companyName || '-')}</td>
            <td class="px-5 py-3">${escapeHtml(job.location || '-')}</td>
            <td class="px-5 py-3">${job.minSalary || ''}${job.minSalary && job.maxSalary ? ' - ' : ''}${job.maxSalary || ''}${job.minSalary || job.maxSalary ? ' AZN' : '-'}</td>
            <td class="px-5 py-3">
                <button onclick="toggleJobActive('${job._id}')" class="badge ${job.isActive ? 'badge-green' : 'badge-red'}">
                    ${job.isActive ? 'Active' : 'Inactive'}
                </button>
            </td>
            <td class="px-5 py-3">${job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '-'}</td>
            <td class="px-5 py-3">
                <div class="flex items-center gap-2">
                    <button onclick="editJob('${job._id}')" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Edit</button>
                    <button onclick="deleteJob('${job._id}')" class="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');

    renderPagination(data);
}

function renderPagination(data) {
    const pagination = document.getElementById('pagination');
    if (data.totalPages <= 1) {
        pagination.innerHTML = `<span class="text-sm text-gray-500">${data.total} total jobs</span>`;
        return;
    }
    pagination.innerHTML = `
        <span class="text-sm text-gray-500">Page ${data.page} of ${data.totalPages} (${data.total} total)</span>
        <div class="flex gap-2">
            <button onclick="loadJobs(${data.page - 1})" class="px-3 py-1 text-sm ${data.page <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'} border rounded" ${data.page <= 1 ? 'disabled' : ''}>Prev</button>
            <button onclick="loadJobs(${data.page + 1})" class="px-3 py-1 text-sm ${data.page >= data.totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'} border rounded" ${data.page >= data.totalPages ? 'disabled' : ''}>Next</button>
        </div>
    `;
}

function openJobModal() {
    editingJobId = null;
    document.getElementById('jobForm').reset();
    document.getElementById('jobId').value = '';
    document.getElementById('jobModalTitle').textContent = 'Add Job';
    document.getElementById('jobModal').classList.remove('hidden');
    document.body.classList.add('modal-open');
}

function closeJobModal() {
    document.getElementById('jobModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

async function editJob(id) {
    try {
        const { data } = await axios.get(`/api/admin/jobs/${id}`);
        editingJobId = id;
        document.getElementById('jobModalTitle').textContent = 'Edit Job';
        document.getElementById('jobId').value = id;
        document.getElementById('jobTitle').value = data.title || '';
        document.getElementById('jobCompany').value = data.companyName || '';
        document.getElementById('jobLocation').value = data.location || '';
        document.getElementById('jobType').value = data.jobType || '';
        document.getElementById('jobMinSalary').value = data.minSalary || '';
        document.getElementById('jobMaxSalary').value = data.maxSalary || '';
        document.getElementById('jobEmail').value = data.email || '';
        document.getElementById('jobPhone').value = data.phone || '';
        document.getElementById('jobDescription').value = data.description || '';
        document.getElementById('jobIsActive').checked = data.isActive !== false;
        document.getElementById('jobIsPremium').checked = data.isPremium === true;
        document.getElementById('jobModal').classList.remove('hidden');
        document.body.classList.add('modal-open');
    } catch (err) {
        alert('Error loading job: ' + err.message);
    }
}

async function deleteJob(id) {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
        await axios.delete(`/api/admin/jobs/${id}`);
        loadJobs(currentPage);
    } catch (err) {
        alert('Error deleting job: ' + err.message);
    }
}

async function toggleJobActive(id) {
    try {
        await axios.patch(`/api/admin/jobs/${id}/toggle`);
        loadJobs(currentPage);
    } catch (err) {
        alert('Error toggling job status: ' + err.message);
    }
}

async function handleJobSubmit(e) {
    e.preventDefault();
    const payload = {
        title: document.getElementById('jobTitle').value,
        companyName: document.getElementById('jobCompany').value,
        location: document.getElementById('jobLocation').value,
        jobType: document.getElementById('jobType').value,
        minSalary: document.getElementById('jobMinSalary').value ? Number(document.getElementById('jobMinSalary').value) : undefined,
        maxSalary: document.getElementById('jobMaxSalary').value ? Number(document.getElementById('jobMaxSalary').value) : undefined,
        email: document.getElementById('jobEmail').value,
        phone: document.getElementById('jobPhone').value,
        description: document.getElementById('jobDescription').value,
        isActive: document.getElementById('jobIsActive').checked,
        isPremium: document.getElementById('jobIsPremium').checked
    };

    try {
        if (editingJobId) {
            await axios.put(`/api/admin/jobs/${editingJobId}`, payload);
        } else {
            await axios.post('/api/admin/jobs', payload);
        }
        closeJobModal();
        loadJobs(currentPage);
    } catch (err) {
        alert('Error saving job: ' + err.message);
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
