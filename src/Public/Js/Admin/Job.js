let currentPage = 1;
let editingJobId = null;
let enumsCache = null;
let jobEditorInstance = null;

document.addEventListener('DOMContentLoaded', async function () {
    await loadEnums();
    loadJobs();
    var form = document.getElementById('jobForm');
    if (form) form.addEventListener('submit', handleJobSubmit);
});

function getFilterValue(id) {
    var el = document.getElementById(id);
    return el ? el.value : '';
}

function getFilterChecked(id) {
    var el = document.getElementById(id);
    return el ? el.checked : false;
}

// ========== Enums ==========

async function loadEnums() {
    try {
        var { data } = await axios.get('/api/admin/enums');
        enumsCache = data;
    } catch (e) {
        enumsCache = { jobTypes: {}, education: {}, experience: {} };
    }
}

function resolveJobType(val) {
    if (!enumsCache || !enumsCache.jobTypes) return val || '-';
    return enumsCache.jobTypes[val] || val || '-';
}

function resolveEducation(val) {
    if (!enumsCache || !enumsCache.education) return val || '-';
    return enumsCache.education[val] || val || '-';
}

function resolveExperience(val) {
    if (!enumsCache || !enumsCache.experience) return val || '-';
    return enumsCache.experience[val] || val || '-';
}

function resolveSiteName(val) {
    if (!enumsCache || !enumsCache.sites) return val || '-';
    return enumsCache.sites[val] || val || '-';
}

// ========== Jobs List ==========

async function loadJobs(page) {
    if (page !== undefined) currentPage = page;
    var search = getFilterValue('searchInput');
    var isActive = getFilterValue('statusFilter');

    try {
        var params = { page: currentPage, limit: 20 };
        if (search) params.search = search;
        if (isActive) params.isActive = isActive;

        var { data } = await axios.get('/api/admin/jobs', { params: params });
        renderJobsTable(data);
    } catch (err) {
        var tbody = document.getElementById('jobsTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" class="px-5 py-8 text-center text-red-400">Error: ' + escapeHtml(err.message) + '</td></tr>';
        }
    }
}

function renderJobsTable(data) {
    var tbody = document.getElementById('jobsTableBody');
    if (!data.jobs || data.jobs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="px-5 py-8 text-center text-gray-400">No jobs found</td></tr>';
        var pagination = document.getElementById('pagination');
        if (pagination) pagination.innerHTML = '';
        return;
    }

    tbody.innerHTML = data.jobs.map(function (job) {
        var salaryHtml = '-';
        if (job.minSalary || job.maxSalary) {
            salaryHtml = (job.minSalary || '') + (job.minSalary && job.maxSalary ? ' - ' : '') + (job.maxSalary || '') + ' AZN';
        }
        var statusBadgeClass = job.isActive ? 'badge-green' : 'badge-red';
        var statusLabel = job.isActive ? 'Active' : 'Inactive';
        var toggleLabel = job.isActive ? 'Deactivate' : 'Activate';
        var createdDate = job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '-';

        return '<tr class="border-b hover:bg-gray-50">' +
            '<td class="px-5 py-3 font-medium text-gray-900 max-w-xs truncate" title="' + escapeHtml(job.title) + '">' + escapeHtml(job.title) + '</td>' +
            '<td class="px-5 py-3">' + escapeHtml(job.companyName || '-') + '</td>' +
            '<td class="px-5 py-3">' + escapeHtml(job.location || '-') + '</td>' +
            '<td class="px-5 py-3">' + salaryHtml + '</td>' +
            '<td class="px-5 py-3">' +
                '<span class="badge ' + statusBadgeClass + '">' + statusLabel + '</span>' +
                '<span class="badge badge-blue ml-1">' + resolveJobType(job.jobType) + '</span>' +
            '</td>' +
            '<td class="px-5 py-3">' + createdDate + '</td>' +
            '<td class="px-5 py-3">' +
                '<div class="flex items-center gap-2">' +
                    '<button onclick="showJobDetail(\'' + job._id + '\')" class="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>' +
                    '<button onclick="editJob(\'' + job._id + '\')" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Edit</button>' +
                    '<button onclick="toggleJobActive(\'' + job._id + '\')" class="text-amber-600 hover:text-amber-800 text-sm font-medium">' + toggleLabel + '</button>' +
                    '<button onclick="deleteJob(\'' + job._id + '\')" class="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>' +
                '</div>' +
            '</td>' +
        '</tr>';
    }).join('');

    renderPagination(data);
}

function renderPagination(data) {
    var pagination = document.getElementById('pagination');
    if (!pagination) return;

    if (data.totalPages <= 1) {
        pagination.innerHTML = '<span class="text-sm text-gray-500">' + data.total + ' total records</span>';
        return;
    }

    var prevDisabled = data.page <= 1;
    var nextDisabled = data.page >= data.totalPages;

    var prevClass = 'px-3 py-1 text-sm border rounded ' + (prevDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100');
    var nextClass = 'px-3 py-1 text-sm border rounded ' + (nextDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100');

    pagination.innerHTML =
        '<span class="text-sm text-gray-500">Page ' + data.page + ' of ' + data.totalPages + ' (' + data.total + ' total)</span>' +
        '<div class="flex gap-2">' +
            '<button onclick="loadJobs(' + (data.page - 1) + ')" class="' + prevClass + '" ' + (prevDisabled ? 'disabled' : '') + '>Prev</button>' +
            '<button onclick="loadJobs(' + (data.page + 1) + ')" class="' + nextClass + '" ' + (nextDisabled ? 'disabled' : '') + '>Next</button>' +
        '</div>';
}

// ========== CKEditor 5 ==========

function initJobEditor() {
    var el = document.querySelector('#jobDescription');
    if (!el) return;
    if (jobEditorInstance) {
        jobEditorInstance.destroy();
        jobEditorInstance = null;
    }
    ClassicEditor.create(el, {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo']
    })
        .then(function (editor) {
            jobEditorInstance = editor;
        })
        .catch(function (err) {
            console.error(err);
        });
}

function getJobEditorData() {
    if (jobEditorInstance) {
        return jobEditorInstance.getData();
    }
    var el = document.getElementById('jobDescription');
    return el ? el.value : '';
}

function destroyJobEditor() {
    if (jobEditorInstance) {
        jobEditorInstance.destroy();
        jobEditorInstance = null;
    }
}

// ========== Modal ==========

function openJobModal() {
    destroyJobEditor();
    editingJobId = null;
    var form = document.getElementById('jobForm');
    if (form) form.reset();
    document.getElementById('jobId').value = '';
    document.getElementById('jobModalTitle').textContent = 'Add Job';
    document.getElementById('jobModal').classList.remove('hidden');
    document.body.classList.add('modal-open');
    initJobEditor();
}

function closeJobModal() {
    destroyJobEditor();
    document.getElementById('jobModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

// ========== CRUD ==========

async function editJob(id) {
    try {
        var { data } = await axios.get('/api/admin/jobs/' + id);
        editingJobId = id;

        destroyJobEditor();

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
        initJobEditor();
    } catch (err) {
        alert('Error loading job: ' + err.message);
    }
}

async function deleteJob(id) {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
        await axios.delete('/api/admin/jobs/' + id);
        loadJobs(currentPage);
    } catch (err) {
        alert('Error deleting job: ' + err.message);
    }
}

async function toggleJobActive(id) {
    try {
        await axios.patch('/api/admin/jobs/' + id + '/toggle');
        loadJobs(currentPage);
    } catch (err) {
        alert('Error toggling job status: ' + err.message);
    }
}

async function removeDuplicateJobs() {
    if (!confirm('Are you sure you want to remove duplicate jobs from the last 30 days?')) return;
    try {
        var { data } = await axios.post('/api/admin/jobs/remove-duplicates');
        alert(data.message || 'Operation completed');
        loadJobs(currentPage);
    } catch (err) {
        alert('Error removing duplicates: ' + (err.response && err.response.data && err.response.data.error ? err.response.data.error : err.message));
    }
}

// ========== Job Detail ==========

async function showJobDetail(id) {
    try {
        var { data } = await axios.get('/api/admin/jobs/' + id);
        var content = document.getElementById('jobDetailContent');
        var description = data.description ? data.description.substring(0, 500) : '-';
        var salaryHtml = '-';
        if (data.minSalary || data.maxSalary) {
            salaryHtml = (data.minSalary || '') + (data.minSalary && data.maxSalary ? ' - ' : '') + (data.maxSalary || '') + ' AZN';
        }

        content.innerHTML =
            '<div class="border-b pb-3 mb-3">' +
                '<h3 class="text-lg font-semibold text-gray-900">' + escapeHtml(data.title) + '</h3>' +
                '<p class="text-sm text-gray-500">' + escapeHtml(data.companyName || '-') + ' &middot; ' + escapeHtml(data.location || '-') + '</p>' +
            '</div>' +
            '<div class="grid grid-cols-2 gap-3 text-sm">' +
                '<div><span class="text-xs text-gray-500 font-medium">Job Type</span><p class="text-gray-800">' + resolveJobType(data.jobType) + '</p></div>' +
                '<div><span class="text-xs text-gray-500 font-medium">Salary</span><p class="text-gray-800">' + salaryHtml + '</p></div>' +
                (data.educationId ? '<div><span class="text-xs text-gray-500 font-medium">Education</span><p class="text-gray-800">' + resolveEducation(data.educationId) + '</p></div>' : '') +
                (data.experienceId ? '<div><span class="text-xs text-gray-500 font-medium">Experience</span><p class="text-gray-800">' + resolveExperience(data.experienceId) + '</p></div>' : '') +
                '<div><span class="text-xs text-gray-500 font-medium">Source</span><p class="text-gray-800">' + resolveSiteName(data.sourceUrl) + '</p></div>' +
                '<div><span class="text-xs text-gray-500 font-medium">Email</span><p class="text-gray-800">' + escapeHtml(data.email || '-') + '</p></div>' +
                '<div><span class="text-xs text-gray-500 font-medium">Phone</span><p class="text-gray-800">' + escapeHtml(data.phone || '-') + '</p></div>' +
                '<div><span class="text-xs text-gray-500 font-medium">Status</span><p class="text-gray-800"><span class="badge ' + (data.isActive ? 'badge-green' : 'badge-red') + '">' + (data.isActive ? 'Active' : 'Inactive') + '</span></p></div>' +
                '<div><span class="text-xs text-gray-500 font-medium">Premium</span><p class="text-gray-800">' + (data.isPremium ? 'Yes' : 'No') + '</p></div>' +
                (data.sourceUrl ? '<div class="col-span-2"><span class="text-xs text-gray-500 font-medium">Source URL</span><p class="text-gray-800 truncate"><a href="' + escapeHtml(data.sourceUrl) + '" target="_blank" class="text-indigo-600 hover:underline">' + escapeHtml(data.sourceUrl) + '</a></p></div>' : '') +
            '</div>' +
            (description && description !== '-' ? '<div class="mt-3 pt-3 border-t"><span class="text-xs text-gray-500 font-medium">Description</span><div class="text-sm text-gray-700 mt-1 prose prose-sm max-w-none">' + description + '</div></div>' : '') +
            '<div class="mt-3 pt-3 border-t text-xs text-gray-400">' +
                'Created: ' + (data.createdAt ? new Date(data.createdAt).toLocaleString() : '-') +
                ' &middot; Posted: ' + (data.postedAt ? new Date(data.postedAt).toLocaleString() : '-') +
            '</div>';

        document.getElementById('jobDetailModal').classList.remove('hidden');
        document.body.classList.add('modal-open');
    } catch (err) {
        alert('Error loading job details: ' + err.message);
    }
}

function closeJobDetail() {
    document.getElementById('jobDetailModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

async function handleJobSubmit(e) {
    e.preventDefault();
    var description = getJobEditorData();

    var payload = {
        title: document.getElementById('jobTitle').value,
        companyName: document.getElementById('jobCompany').value,
        location: document.getElementById('jobLocation').value,
        jobType: document.getElementById('jobType').value,
        minSalary: document.getElementById('jobMinSalary').value ? Number(document.getElementById('jobMinSalary').value) : undefined,
        maxSalary: document.getElementById('jobMaxSalary').value ? Number(document.getElementById('jobMaxSalary').value) : undefined,
        email: document.getElementById('jobEmail').value,
        phone: document.getElementById('jobPhone').value,
        description: description,
        isActive: document.getElementById('jobIsActive').checked,
        isPremium: document.getElementById('jobIsPremium').checked
    };

    try {
        if (editingJobId) {
            await axios.put('/api/admin/jobs/' + editingJobId, payload);
        } else {
            await axios.post('/api/admin/jobs', payload);
        }
        closeJobModal();
        loadJobs(currentPage);
    } catch (err) {
        alert('Error saving job: ' + (err.response && err.response.data && err.response.data.error ? err.response.data.error : err.message));
    }
}

function escapeHtml(text) {
    if (!text && text !== 0) return '';
    var d = document.createElement('div');
    d.textContent = String(text);
    return d.innerHTML;
}
