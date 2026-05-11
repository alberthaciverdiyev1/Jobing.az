let currentPage = 1;
let mapInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    loadVisitors();
    loadLeafletMap();
});

function loadLeafletMap() {
    const container = document.getElementById('visitorMap');
    if (!container) return;

    if (typeof L !== 'undefined') {
        initMap();
    } else {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initMap;
        document.body.appendChild(script);
    }
}

function initMap() {
    const container = document.getElementById('visitorMap');
    if (!container) return;
    container.innerHTML = '';

    mapInstance = L.map('visitorMap').setView([40.4093, 49.8671], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(mapInstance);
}

function addVisitorToMap(visitor) {
    if (!mapInstance) return;

    var lat = 40.4093 + (Math.random() - 0.5) * 0.5;
    var lng = 49.8671 + (Math.random() - 0.5) * 0.5;

    var size = Math.min(30, Math.max(8, (visitor.visitCount || 1) * 3));
    var color = visitor.visitCount > 10 ? '#ef4444' : visitor.visitCount > 5 ? '#f59e0b' : '#3b82f6';

    var marker = L.circleMarker([lat, lng], {
        radius: size,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7
    }).addTo(mapInstance);

    marker.bindPopup(
        '<b>IP:</b> ' + (visitor.ip || 'Unknown') + '<br>' +
        '<b>Visits:</b> ' + (visitor.visitCount || 0) + '<br>' +
        '<b>Last:</b> ' + (visitor.lastVisit ? new Date(visitor.lastVisit).toLocaleString() : 'N/A') + '<br>' +
        '<b>Location:</b> Baku, Azerbaijan'
    );

    var bounds = mapInstance.getBounds();
    if (!bounds.contains([lat, lng])) {
        mapInstance.setView([40.4093, 49.8671], 7);
    }
}

async function loadVisitors(page) {
    if (page !== undefined) currentPage = page;

    try {
        var params = { page: currentPage, limit: 20 };
        var res = await axios.get('/api/admin/visitors', { params: params });
        var data = res.data;
        renderVisitorData(data);
    } catch (err) {
        var tbody = document.getElementById('visitorsTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="4" class="px-5 py-8 text-center text-red-400">Error: ' + err.message + '</td></tr>';
    }
}

function renderVisitorData(data) {
    var totalVisitorsEl = document.getElementById('totalVisitors');
    var totalVisitsEl = document.getElementById('totalVisits');
    if (totalVisitorsEl) totalVisitorsEl.textContent = data.total || 0;
    if (totalVisitsEl) totalVisitsEl.textContent = data.totalVisits || 0;

    renderDailyChart(data.dailyStats || []);

    if (mapInstance && data.visitors) {
        data.visitors.forEach(addVisitorToMap);
    }

    var tbody = document.getElementById('visitorsTableBody');
    if (!tbody) return;

    if (!data.visitors || data.visitors.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="px-5 py-8 text-center text-gray-400">No visitors found</td></tr>';
        var pag = document.getElementById('pagination');
        if (pag) pag.innerHTML = '';
        return;
    }

    tbody.innerHTML = data.visitors.map(function(v) {
        return '<tr class="border-b hover:bg-gray-50">' +
            '<td class="px-5 py-3 font-mono text-sm">' + escapeHtml(v.ip || '-') + '</td>' +
            '<td class="px-5 py-3 font-medium">' + (v.visitCount || 0) + '</td>' +
            '<td class="px-5 py-3">' + (v.lastVisit ? new Date(v.lastVisit).toLocaleString() : '-') + '</td>' +
            '<td class="px-5 py-3 max-w-xs truncate text-xs text-gray-400">' + escapeHtml((v.userAgent || '-').substring(0, 80)) + '</td>' +
            '</tr>';
    }).join('');

    var pagination = document.getElementById('pagination');
    if (!pagination) return;
    if (data.totalPages <= 1) {
        pagination.innerHTML = '<span class="text-sm text-gray-500">' + data.total + ' unique visitors</span>';
    } else {
        pagination.innerHTML =
            '<span class="text-sm text-gray-500">Page ' + data.page + ' of ' + data.totalPages + '</span>' +
            '<div class="flex gap-2">' +
            '<button onclick="loadVisitors(' + (data.page - 1) + ')" class="px-3 py-1 text-sm border rounded ' + (data.page <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100') + '" ' + (data.page <= 1 ? 'disabled' : '') + '>Prev</button>' +
            '<button onclick="loadVisitors(' + (data.page + 1) + ')" class="px-3 py-1 text-sm border rounded ' + (data.page >= data.totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100') + '" ' + (data.page >= data.totalPages ? 'disabled' : '') + '>Next</button>' +
            '</div>';
    }
}

function renderDailyChart(dailyStats) {
    var container = document.getElementById('dailyChart');
    if (!container) return;

    if (!dailyStats || dailyStats.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-400 py-8">No data available</div>';
        return;
    }

    var sorted = dailyStats.slice().reverse();
    var maxVisits = Math.max.apply(null, sorted.map(function(d) { return d.visits; }), 1);

    var barsHtml = sorted.map(function(d) {
        var height = Math.max((d.visits / maxVisits) * 100, 3);
        var dateParts = d._id ? d._id.split('-') : [];
        var label = dateParts.length === 3 ? dateParts[1] + '/' + dateParts[2] : d._id;
        return '<div class="flex flex-col items-center gap-1 flex-1">' +
            '<span class="text-xs text-gray-400">' + d.visits + '</span>' +
            '<div class="w-full bg-indigo-100 rounded-t relative" style="height: 80px;">' +
            '<div class="absolute bottom-0 w-full bg-indigo-500 rounded-t transition-all duration-300 hover:bg-indigo-600" style="height: ' + height + '%;" title="' + label + ': ' + d.visits + ' visits"></div>' +
            '</div>' +
            '<span class="text-xs text-gray-500 truncate w-full text-center" style="font-size: 9px;">' + label + '</span>' +
            '</div>';
    }).join('');

    container.innerHTML = '<div class="flex items-end gap-1 h-full w-full px-2 py-4">' + barsHtml + '</div>';
}

function escapeHtml(text) {
    if (!text) return '';
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}
