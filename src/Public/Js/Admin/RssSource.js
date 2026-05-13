document.addEventListener('DOMContentLoaded', function() {
    loadSources();
});

async function loadSources() {
    try {
        var res = await axios.get('/api/admin/rss-sources');
        var sources = res.data || [];
        var tbody = document.getElementById('rssSourceTableBody');
        if (!tbody) return;

        if (sources.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="px-5 py-8 text-center text-gray-400">Heç bir RSS mənbəsi yoxdur</td></tr>';
            return;
        }

        tbody.innerHTML = sources.map(function(s) {
            var lastFetch = s.lastFetchedAt ? new Date(s.lastFetchedAt).toLocaleString() : '-';
            var statusHtml = s.isActive
                ? '<span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Aktiv</span>'
                : '<span class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Deaktiv</span>';

            return '<tr class="border-b hover:bg-gray-50">' +
                '<td class="px-5 py-3 font-medium text-gray-900">' + escapeHtml(s.name || '-') + '</td>' +
                '<td class="px-5 py-3 text-sm text-gray-500 max-w-[200px] truncate">' + escapeHtml(s.url) + '</td>' +
                '<td class="px-5 py-3 text-sm text-gray-500">' + escapeHtml(s.category || '-') + '</td>' +
                '<td class="px-5 py-3 text-sm text-gray-500">' + lastFetch + '</td>' +
                '<td class="px-5 py-3">' + statusHtml + '</td>' +
                '<td class="px-5 py-3">' +
                '<button onclick="importSource(\'' + s._id + '\')" class="px-2 py-1 text-xs text-emerald-600 hover:bg-emerald-50 rounded mr-1">İdxal Et</button>' +
                '<button onclick="deleteSource(\'' + s._id + '\')" class="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded">Sil</button>' +
                '</td>' +
                '</tr>';
        }).join('');
    } catch (err) {
        var tbody = document.getElementById('rssSourceTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="px-5 py-8 text-center text-red-400">Xəta: ' + err.message + '</td></tr>';
    }
}

function showAddModal() {
    document.getElementById('addModal').classList.remove('hidden');
}

function closeAddModal() {
    document.getElementById('addModal').classList.add('hidden');
    document.getElementById('sourceName').value = '';
    document.getElementById('sourceUrl').value = '';
    document.getElementById('sourceCategory').value = '';
}

async function addSource() {
    var url = document.getElementById('sourceUrl').value.trim();
    if (!url) return alertify.error('URL daxil edin');

    try {
        await axios.post('/api/admin/rss-sources', {
            url: url,
            name: document.getElementById('sourceName').value.trim(),
            category: document.getElementById('sourceCategory').value.trim()
        });
        alertify.success('Mənbə əlavə edildi');
        closeAddModal();
        loadSources();
    } catch (err) {
        alertify.error(err.response?.data?.error || 'Xəta baş verdi');
    }
}

async function deleteSource(id) {
    if (!confirm('Bu RSS mənbəsini silmək istədiyinizə əminsiniz?')) return;
    try {
        await axios.delete('/api/admin/rss-sources/' + id);
        alertify.success('Mənbə silindi');
        loadSources();
    } catch (err) {
        alertify.error(err.response?.data?.error || 'Xəta baş verdi');
    }
}

async function importSource(id) {
    try {
        var res = await axios.post('/api/admin/rss-sources/' + id + '/import');
        var r = res.data;
        alertify.success(r.imported + ' yeni xəbər idxal edildi, ' + r.skipped + ' keçildi');
        loadSources();
    } catch (err) {
        alertify.error(err.response?.data?.error || 'İdxal xətası');
    }
}

async function importAllSources() {
    try {
        var res = await axios.post('/api/admin/rss-sources/import-all');
        var results = res.data || [];
        var total = 0;
        results.forEach(function(r) {
            if (r.success) total += r.imported || 0;
        });
        alertify.success('Cəmi ' + total + ' xəbər idxal edildi');
        loadSources();
    } catch (err) {
        alertify.error(err.response?.data?.error || 'İdxal xətası');
    }
}

function escapeHtml(text) {
    if (!text) return '';
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}
