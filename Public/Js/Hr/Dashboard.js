document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    document.getElementById('liveTimestamp').textContent = new Date().toLocaleString();
});

async function loadStats() {
    try {
        var res = await axios.get('/api/hr/stats');
        var data = res.data;
        document.getElementById('statTotalJobs').textContent = data.totalJobs || 0;
        document.getElementById('statActiveJobs').innerHTML = '<span class="font-medium">Active:</span> ' + (data.activeJobs || 0);
        document.getElementById('statApplications').textContent = data.totalApplications || 0;
        document.getElementById('statInterviews').innerHTML = '<span class="font-medium">Interviews:</span> ' + (data.interviewCount || 0);
        document.getElementById('statUpcomingInterviews').textContent = data.upcomingInterviews || 0;
        document.getElementById('statCompanies').textContent = (data.companyNames || []).length;
        document.getElementById('statCompanyNames').textContent = (data.companyNames || []).join(', ') || '-';
        renderRecentApplications(data.recentApplications || []);
    } catch (err) {
        console.error('Failed to load stats:', err);
    }
}

function renderRecentApplications(applications) {
    var tbody = document.getElementById('recentAppsBody');
    if (!tbody) return;

    if (!applications || applications.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="px-5 py-8 text-center text-gray-400">No applications yet</td></tr>';
        return;
    }

    tbody.innerHTML = applications.map(function(app) {
        var name = app.userId ? (app.userId.name + ' ' + (app.userId.surname || '')).trim() : 'Unknown';
        var jobTitle = app.jobId ? app.jobId.title : 'Unknown Job';
        var statusClass = {
            'pending': 'bg-yellow-100 text-yellow-700',
            'accepted': 'bg-green-100 text-green-700',
            'rejected': 'bg-red-100 text-red-700',
            'interview': 'bg-blue-100 text-blue-700'
        }[app.status] || 'bg-gray-100 text-gray-700';
        var statusLabel = app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Unknown';
        var date = app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '-';

        return '<tr class="hover:bg-gray-50 transition-colors">' +
            '<td class="px-5 py-3 text-sm text-gray-900">' + escapeHtml(name) + '</td>' +
            '<td class="px-5 py-3 text-sm text-gray-600">' + escapeHtml(jobTitle) + '</td>' +
            '<td class="px-5 py-3"><span class="px-2 py-0.5 text-xs font-medium rounded-full ' + statusClass + '">' + statusLabel + '</span></td>' +
            '<td class="px-5 py-3 text-sm text-gray-500">' + date + '</td>' +
            '</tr>';
    }).join('');
}

function escapeHtml(text) {
    if (!text) return '';
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}
