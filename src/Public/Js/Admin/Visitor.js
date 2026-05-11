let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    loadVisitors();
});

async function loadVisitors(page = 1) {
    currentPage = page;

    try {
        const { data } = await axios.get('/api/admin/visitors', { params: { page, limit: 20 } });
        renderVisitorData(data);
    } catch (err) {
        document.getElementById('visitorsTableBody').innerHTML =
            `<tr><td colspan="4" class="px-5 py-8 text-center text-red-400">Error: ${err.message}</td></tr>`;
    }
}

function renderVisitorData(data) {
    document.getElementById('totalVisitors').textContent = data.total || 0;
    document.getElementById('totalVisits').textContent = data.totalVisits || 0;

    // Render daily chart
    renderDailyChart(data.dailyStats || []);

    // Render table
    const tbody = document.getElementById('visitorsTableBody');

    if (!data.visitors || data.visitors.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="px-5 py-8 text-center text-gray-400">No visitors found</td></tr>`;
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    tbody.innerHTML = data.visitors.map(v => `
        <tr class="border-b hover:bg-gray-50">
            <td class="px-5 py-3 font-mono text-sm">${v.ip || '-'}</td>
            <td class="px-5 py-3 font-medium">${v.visitCount || 0}</td>
            <td class="px-5 py-3">${v.lastVisit ? new Date(v.lastVisit).toLocaleString() : '-'}</td>
            <td class="px-5 py-3 max-w-xs truncate text-xs text-gray-400">${v.userAgent || '-'}</td>
        </tr>
    `).join('');

    document.getElementById('pagination').innerHTML = `
        <span class="text-sm text-gray-500">${data.total} unique visitors</span>
        ${data.totalPages > 1 ? `
        <div class="flex gap-2">
            <button onclick="loadVisitors(${data.page - 1})" class="px-3 py-1 text-sm ${data.page <= 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'} border rounded" ${data.page <= 1 ? 'disabled' : ''}>Prev</button>
            <button onclick="loadVisitors(${data.page + 1})" class="px-3 py-1 text-sm ${data.page >= data.totalPages ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'} border rounded" ${data.page >= data.totalPages ? 'disabled' : ''}>Next</button>
        </div>` : ''}
    `;
}

function renderDailyChart(dailyStats) {
    const container = document.getElementById('dailyChart');

    if (!dailyStats || dailyStats.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-400">No data available</div>';
        return;
    }

    const sorted = [...dailyStats].reverse();
    const maxVisits = Math.max(...sorted.map(d => d.visits), 1);

    let barsHtml = sorted.map(d => {
        const height = Math.max((d.visits / maxVisits) * 100, 3);
        const date = new Date(d._id);
        const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return `
            <div class="flex flex-col items-center gap-1 flex-1">
                <span class="text-xs text-gray-400">${d.visits}</span>
                <div class="w-full bg-indigo-100 rounded-t relative" style="height: 100px;">
                    <div class="absolute bottom-0 w-full bg-indigo-500 rounded-t transition-all duration-300 hover:bg-indigo-600"
                         style="height: ${height}%;" title="${label}: ${d.visits} visits"></div>
                </div>
                <span class="text-xs text-gray-500 truncate w-full text-center" style="font-size: 9px;">${label}</span>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="flex items-end gap-1 h-full w-full px-2">
            ${barsHtml}
        </div>
    `;
}
