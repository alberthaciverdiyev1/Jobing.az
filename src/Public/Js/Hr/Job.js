let currentPage = 1;
let jobTypesMap = {};
let categories = [];
let applicationCounts = {};

document.addEventListener('DOMContentLoaded', () => {
    loadEnums();
    loadCategories();
    loadCompanies();
    loadJobs();
});

async function loadEnums() {
    try {
        var res = await axios.get('/api/hr/enums');
        jobTypesMap = res.data.jobTypes || {};
        var sel = document.getElementById('jobType');
        if (sel) {
            sel.innerHTML = '<option value="">Select Type</option>';
            Object.keys(jobTypesMap).forEach(function(k) {
                sel.innerHTML += '<option value="' + k + '">' + jobTypesMap[k] + '</option>';
            });
        }
    } catch (err) { console.error(err); }
}

async function loadCategories() {
    try {
        var res = await axios.get('/api/categories');
        categories = res.data || [];
        var sel = document.getElementById('jobCategory');
        if (sel) {
            sel.innerHTML = '<option value="">Select Category</option>';
            categories.forEach(function(c) {
                sel.innerHTML += '<option value="' + c.localCategoryId + '">' + c.categoryName + '</option>';
            });
        }
    } catch (err) { console.error(err); }
}

async function loadCompanies() {
    try {
        var res = await axios.get('/api/hr/companies');
        var companies = res.data || [];
        var sel = document.getElementById('jobCompany');
        if (sel) {
            sel.innerHTML = '<option value="">Select Company</option>';
            if (companies.length === 1) {
                var c = companies[0];
                sel.innerHTML += '<option value="' + (c._id) + '" selected>' + c.companyName + '</option>';
            } else {
                companies.forEach(function(c) {
                    sel.innerHTML += '<option value="' + (c._id) + '">' + c.companyName + '</option>';
                });
            }
        }
    } catch (err) { console.error(err); }
}

function searchJobs() {
    currentPage = 1;
    loadJobs();
}

async function loadJobs(page) {
    if (page !== undefined) currentPage = page;

    try {
        var params = {
            page: currentPage,
            limit: 20,
            search: document.getElementById('searchInput')?.value || '',
            isActive: document.getElementById('statusFilter')?.value || undefined
        };

        var res = await axios.get('/api/hr/jobs', { params: params });
        var data = res.data;
        // Fetch application counts for all jobs
        if (data.jobs && data.jobs.length > 0) {
            var ids = data.jobs.map(function(j) { return j._id; }).join(',');
            try {
                var countRes = await axios.get('/api/hr/application-counts', { params: { jobIds: ids } });
                applicationCounts = countRes.data || {};
            } catch (e) { /* silent */ }
        }
        renderJobs(data);
    } catch (err) {
        var tbody = document.getElementById('jobsTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="7" class="px-5 py-8 text-center text-red-400">Error: ' + err.message + '</td></tr>';
    }
}

function renderJobs(data) {
    var tbody = document.getElementById('jobsTableBody');
    if (!tbody) return;

    if (!data.jobs || data.jobs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="px-5 py-8 text-center text-gray-400">No jobs found</td></tr>';
        var pag = document.getElementById('pagination');
        if (pag) pag.innerHTML = '';
        return;
    }

    tbody.innerHTML = data.jobs.map(function(j) {
        return '<tr class="border-b hover:bg-gray-50">' +
            '<td class="px-5 py-3 font-medium">' + escapeHtml(j.title) + '</td>' +
            '<td class="px-5 py-3 text-sm text-gray-500">' + escapeHtml(j.companyName || '-') + '</td>' +
            '<td class="px-5 py-3"><span class="px-2 py-1 text-xs rounded-full ' + (j.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700') + '">' + (j.isActive ? 'Active' : 'Inactive') + '</span></td>' +
            '<td class="px-5 py-3 text-sm text-gray-500">' + ((applicationCounts[j._id] && applicationCounts[j._id].total) || '-') + '</td>' +
            '<td class="px-5 py-3 text-sm text-gray-500">' + (j.createdAt ? new Date(j.createdAt).toLocaleDateString() : '-') + '</td>' +
            '<td class="px-5 py-3 text-right">' +
            '<a href="/hr/jobs/' + j._id + '" class="px-2 py-1 text-xs text-emerald-600 hover:bg-emerald-50 rounded">View</a>' +
            '<button onclick="toggleJob(\'' + j._id + '\')" class="px-2 py-1 text-xs ' + (j.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50') + ' rounded ml-1">' + (j.isActive ? 'Deactivate' : 'Activate') + '</button>' +
            '<button onclick="editJob(\'' + j._id + '\')" class="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded ml-1">Edit</button>' +
            '</td>' +
            '</tr>';
    }).join('');

    renderPagination(data);
}

function renderPagination(data) {
    var pag = document.getElementById('pagination');
    if (!pag) return;
    if (data.totalPages <= 1) {
        pag.innerHTML = '<span class="text-sm text-gray-500">' + (data.total || 0) + ' jobs</span>';
    } else {
        pag.innerHTML =
            '<span class="text-sm text-gray-500">Page ' + data.page + ' of ' + data.totalPages + '</span>' +
            '<div class="flex gap-2">' +
            '<button onclick="loadJobs(' + (data.page - 1) + ')" class="px-3 py-1 text-sm border rounded ' + (data.page <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100') + '" ' + (data.page <= 1 ? 'disabled' : '') + '>Prev</button>' +
            '<button onclick="loadJobs(' + (data.page + 1) + ')" class="px-3 py-1 text-sm border rounded ' + (data.page >= data.totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100') + '" ' + (data.page >= data.totalPages ? 'disabled' : '') + '>Next</button>' +
            '</div>';
    }
}

async function editJob(id) {
    try {
        var res = await axios.get('/api/hr/jobs/' + id);
        var j = res.data;
        document.getElementById('modalTitle').textContent = 'Edit Job';
        document.getElementById('jobId').value = j._id;
        document.getElementById('jobTitle').value = j.title || '';
        document.getElementById('jobLocation').value = j.location || '';
        document.getElementById('jobEmail').value = j.email || '';
        document.getElementById('jobPhone').value = j.phone || '';
        document.getElementById('jobMinSalary').value = j.minSalary || '';
        document.getElementById('jobMaxSalary').value = j.maxSalary || '';
        document.getElementById('jobDescription').value = j.description || '';
        if (document.getElementById('jobCompany')) document.getElementById('jobCompany').value = j.companyId || '';
        if (document.getElementById('jobType')) document.getElementById('jobType').value = j.jobType || '';
        if (document.getElementById('jobCategory')) document.getElementById('jobCategory').value = j.categoryId || '';
        document.getElementById('jobModal').classList.remove('hidden');
    } catch (err) {
        alertify.error('Failed to load job: ' + err.message);
    }
}

async function saveJob() {
    var id = document.getElementById('jobId').value;
    var data = {
        title: document.getElementById('jobTitle').value,
        companyId: document.getElementById('jobCompany')?.value || null,
        companyName: document.getElementById('jobCompany')?.selectedOptions[0]?.text || '',
        location: document.getElementById('jobLocation').value,
        email: document.getElementById('jobEmail').value,
        phone: document.getElementById('jobPhone').value,
        minSalary: document.getElementById('jobMinSalary').value ? Number(document.getElementById('jobMinSalary').value) : undefined,
        maxSalary: document.getElementById('jobMaxSalary').value ? Number(document.getElementById('jobMaxSalary').value) : undefined,
        jobType: document.getElementById('jobType')?.value || undefined,
        categoryId: document.getElementById('jobCategory')?.value ? Number(document.getElementById('jobCategory').value) : undefined,
        description: document.getElementById('jobDescription').value,
        redirectUrl: '#',
        postedAt: new Date()
    };

    if (!data.title) return alertify.error('Title is required');

    try {
        if (id) {
            await axios.put('/api/hr/jobs/' + id, data);
            alertify.success('Job updated');
        } else {
            await axios.post('/api/hr/jobs', data);
            alertify.success('Job created');
        }
        closeModal('jobModal');
        loadJobs();
    } catch (err) {
        alertify.error(err.response?.data?.error || err.message);
    }
}

async function toggleJob(id) {
    try {
        var res = await axios.patch('/api/hr/jobs/' + id + '/toggle');
        alertify.success(res.data.isActive ? 'Job activated' : 'Job deactivated');
        loadJobs(currentPage);
    } catch (err) {
        alertify.error(err.message);
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
