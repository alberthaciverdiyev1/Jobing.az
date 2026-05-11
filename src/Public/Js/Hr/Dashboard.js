document.addEventListener('DOMContentLoaded', () => {
    loadStats();
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
    } catch (err) {
        console.error('Failed to load stats:', err);
    }
}
