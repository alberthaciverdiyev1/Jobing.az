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
                    '<a href="/vakansiyalar/' + (job.slug || job._id) + '/details" target="_blank" class="text-blue-600 hover:text-blue-800 text-sm font-medium">View</a>' +
                    '<button onclick="editJob(\'' + job._id + '\')" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Edit</button>' +
                    '<button onclick="toggleJobActive(\'' + job._id + '\')" class="text-amber-600 hover:text-amber-800 text-sm font-medium">' + toggleLabel + '</button>' +
                    '<button onclick="deleteJob(\'' + job._id + '\')" class="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>' +
                    '<button onclick="shareJob(\'' + job._id + '\')" class="text-green-600 hover:text-green-800 text-sm font-medium">Paylaş</button>' +
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
        document.getElementById('jobSlug').value = data.slug || '';
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
        slug: document.getElementById('jobSlug').value || undefined,
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

// ========== Share Job ==========

let shareModalVisible = false;

function showShareModal() {
    var modal = document.getElementById('shareModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
        shareModalVisible = true;
    }
}

function closeShareModal() {
    var modal = document.getElementById('shareModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
        shareModalVisible = false;
    }
}

async function shareJob(id) {
    var resultBody = document.getElementById('shareResultBody');
    var summaryEl = document.getElementById('shareSummary');
    if (resultBody) resultBody.innerHTML = '<tr><td colspan="3" class="px-5 py-8 text-center text-gray-400">Paylaşılır...</td></tr>';
    if (summaryEl) summaryEl.textContent = '⏳ Vakansiya paylaşılır...';

    showShareModal();

    try {
        var { data } = await axios.post('/api/admin/jobs/' + id + '/share');

        if (summaryEl) {
            summaryEl.textContent = data.summary.message;
            summaryEl.className = data.summary.failed === 0
                ? 'text-sm font-medium text-green-600'
                : data.summary.succeeded > 0
                    ? 'text-sm font-medium text-amber-600'
                    : 'text-sm font-medium text-red-600';
        }

        if (resultBody) {
            resultBody.innerHTML = data.results.map(function (r) {
                var icon = r.success ? '✅' : '❌';
                var color = r.success ? 'text-green-600' : 'text-red-600';
                var errorText = r.error ? '<span class="text-xs text-gray-400 ml-2">' + escapeHtml(r.error) + '</span>' : '';
                return '<tr class="border-b">' +
                    '<td class="px-5 py-3 capitalize">' + escapeHtml(r.platform) + '</td>' +
                    '<td class="px-5 py-3 ' + color + '">' + icon + ' ' + (r.success ? 'Uğurlu' : 'Uğursuz') + '</td>' +
                    '<td class="px-5 py-3 text-sm text-gray-500">' + errorText + '</td>' +
                    '</tr>';
            }).join('');
        }
    } catch (err) {
        if (summaryEl) {
            summaryEl.textContent = 'Xəta: ' + (err.response?.data?.error || err.message);
            summaryEl.className = 'text-sm font-medium text-red-600';
        }
        if (resultBody) {
            resultBody.innerHTML = '<tr><td colspan="3" class="px-5 py-8 text-center text-red-400">Paylaşım xətası: ' + escapeHtml(err.message) + '</td></tr>';
        }
    }
}

function escapeHtml(text) {
    if (!text && text !== 0) return '';
    var d = document.createElement('div');
    d.textContent = String(text);
    return d.innerHTML;
}
