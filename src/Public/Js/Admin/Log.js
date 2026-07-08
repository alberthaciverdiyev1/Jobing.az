document.addEventListener('DOMContentLoaded', function() {
    loadLogs();
});

async function loadLogs() {
    var days = document.getElementById('daysFilter').value;
    try {
        var { data } = await axios.get('/api/admin/logs', { params: { days } });
        renderLogs(data);
    } catch (err) {
        document.getElementById('logsTableBody').innerHTML =
            '<tr><td colspan="6" class="px-5 py-8 text-center text-red-400">Error: ' + err.message + '</td></tr>';
    }
}

function renderLogs(data) {
    var tbody = document.getElementById('logsTableBody');
    var countEl = document.getElementById('logCount');
    if (countEl) countEl.textContent = data.total + ' logs';

    if (!data.logs || data.logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="px-5 py-8 text-center text-green-500"><svg class="w-12 h-12 mx-auto mb-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>No logs found</td></tr>';
        return;
    }

    tbody.innerHTML = data.logs.map(function(log, i) {
        var ts = log.createdAt ? new Date(log.createdAt).toLocaleString() : '-';
        var level = log.level || 'info';
        var msg = (log.message || '').substring(0, 120);
        var url = log.url || log.metadata?.url || '-';
        var isError = level === 'error';

        return '<tr class="border-b hover:bg-gray-50 ' + (isError ? 'bg-red-50' : '') + '">' +
            '<td class="px-5 py-3">' +
                (isError
                    ? '<span class="w-2 h-2 rounded-full bg-red-500 inline-block"></span>'
                    : '<span class="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>') +
            '</td>' +
            '<td class="px-5 py-3 text-xs font-mono text-gray-500">' + escapeHtml(ts) + '</td>' +
            '<td class="px-5 py-3"><span class="badge ' + (isError ? 'badge-red' : 'badge-blue') + '">' + escapeHtml(level) + '</span></td>' +
            '<td class="px-5 py-3 max-w-md truncate font-medium text-gray-900">' + escapeHtml(msg) + '</td>' +
            '<td class="px-5 py-3 max-w-xs truncate text-xs text-gray-400">' + escapeHtml(url) + '</td>' +
            '<td class="px-5 py-3">' +
                '<button onclick="showLogDetail(' + i + ')" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View</button>' +
            '</td></tr>';
    }).join('');

    window._logData = data.logs;
}

function showLogDetail(index) {
    var log = window._logData[index];
    if (!log) return;

    var content = document.getElementById('logDetailContent');
    var meta = log.metadata || {};
    var stack = (meta.stack || log.stack) ? '<pre class="mt-2 p-3 bg-gray-50 rounded-lg text-xs font-mono text-gray-700 overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto">' + escapeHtml(meta.stack || log.stack) + '</pre>' : '';
    var url = log.url || meta.url || '';
    var method = log.method || meta.method || '';
    var ip = log.ip || meta.ip || '';
    var source = log.source || meta.source || '';

    content.innerHTML =
        '<div class="border-b pb-3 mb-3">' +
            '<div class="flex items-center gap-2 mb-2">' +
                '<span class="badge ' + (log.level === 'error' ? 'badge-red' : 'badge-blue') + '">' + escapeHtml(log.level || 'info') + '</span>' +
                '<span class="text-xs text-gray-400">' + escapeHtml(log.createdAt ? new Date(log.createdAt).toLocaleString() : '') + '</span>' +
            '</div>' +
            '<p class="text-sm font-medium text-gray-900">' + escapeHtml(log.message || '') + '</p>' +
        '</div>' +
        (source ? '<div class="mb-2"><span class="text-xs text-gray-500 font-medium">Source:</span><p class="text-sm text-gray-700">' + escapeHtml(source) + '</p></div>' : '') +
        (url ? '<div class="mb-2"><span class="text-xs text-gray-500 font-medium">URL:</span><p class="text-sm text-gray-700">' + escapeHtml(url) + '</p></div>' : '') +
        (method ? '<div class="mb-2"><span class="text-xs text-gray-500 font-medium">Method:</span><p class="text-sm text-gray-700">' + escapeHtml(method) + '</p></div>' : '') +
        (ip ? '<div class="mb-2"><span class="text-xs text-gray-500 font-medium">IP:</span><p class="text-sm text-gray-700">' + escapeHtml(ip) + '</p></div>' : '') +
        (stack ? '<div><span class="text-xs text-gray-500 font-medium">Stack Trace:</span>' + stack + '</div>' : '');

    document.getElementById('logDetailModal').classList.remove('hidden');
    document.body.classList.add('modal-open');
}

function closeLogDetail() {
    document.getElementById('logDetailModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

function escapeHtml(text) {
    if (!text && text !== 0) return '';
    var d = document.createElement('div');
    d.textContent = String(text);
    return d.innerHTML;
}
