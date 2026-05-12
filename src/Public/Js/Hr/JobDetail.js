// JobDetail.js — additional client-side features for the job detail page
// The main job data is rendered server-side in Detail.ejs
// This file handles dynamic updates like application count refresh

document.addEventListener('DOMContentLoaded', function() {
    // Auto-refresh application counts every 30 seconds
    var jobIdElement = document.querySelector('[data-job-id]');
    if (jobIdElement) {
        var jobId = jobIdElement.getAttribute('data-job-id');
        setInterval(async function() {
            try {
                var res = await axios.get('/api/hr/application-counts', {
                    params: { jobIds: jobId }
                });
                var counts = res.data[jobId];
                var el = document.getElementById('appCount');
                if (el && counts) el.textContent = counts.total || 0;
            } catch (e) { /* silent */ }
        }, 30000);
    }
});
