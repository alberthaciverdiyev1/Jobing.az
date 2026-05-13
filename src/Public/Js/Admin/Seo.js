var seoDefaults = {};
var seoEntries = {};

document.addEventListener('DOMContentLoaded', function() {
    loadSeoData();
});

async function loadSeoData() {
    try {
        var [defaultsRes, entriesRes] = await Promise.all([
            axios.get('/api/admin/seo/defaults'),
            axios.get('/api/admin/seo')
        ]);
        seoDefaults = defaultsRes.data.data || {};
        seoEntries = {};
        var entries = entriesRes.data.data || [];
        entries.forEach(function(e) {
            seoEntries[e.route] = e;
        });
        renderTable();
    } catch (err) {
        var tbody = document.getElementById('seoTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="px-5 py-8 text-center text-red-400">Xəta: ' + err.message + '</td></tr>';
    }
}

function renderTable() {
    var tbody = document.getElementById('seoTableBody');
    if (!tbody) return;

    var routes = Object.keys(seoDefaults);
    if (routes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-5 py-8 text-center text-gray-400">Heç bir səhifə tapılmadı</td></tr>';
        return;
    }

    tbody.innerHTML = routes.map(function(route) {
        var saved = seoEntries[route];
        var defaults = seoDefaults[route];
        var title = saved && saved.title ? saved.title : (defaults ? defaults.title : '');
        var description = saved && saved.description ? saved.description : (defaults ? defaults.description : '');
        var isCustom = !!saved;
        var isActive = saved ? saved.isActive : true;

        var statusHtml = isActive
            ? '<span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Aktiv</span>'
            : '<span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-500">Deaktiv</span>';

        var titleDisplay = isCustom
            ? '<span class="text-gray-900 font-medium">' + escapeHtml(title) + '</span>'
            : '<span class="text-gray-400 italic">' + escapeHtml(title) + '</span>';

        var descDisplay = isCustom
            ? '<span class="text-gray-600 text-xs line-clamp-2">' + escapeHtml(description) + '</span>'
            : '<span class="text-gray-400 italic text-xs line-clamp-2">' + escapeHtml(description) + '</span>';

        var customBadge = isCustom
            ? '<span class="inline-block w-2 h-2 rounded-full bg-indigo-500 ml-1.5" title="Customized"></span>'
            : '';

        return '<tr class="border-b hover:bg-gray-50 cursor-pointer" onclick="openEdit(\'' + escapeHtml(route) + '\')">' +
            '<td class="px-5 py-3 font-mono text-xs text-gray-700">' + escapeHtml(route) + customBadge + '</td>' +
            '<td class="px-5 py-3">' + titleDisplay + '</td>' +
            '<td class="px-5 py-3 hidden md:table-cell">' + descDisplay + '</td>' +
            '<td class="px-5 py-3">' + statusHtml + '</td>' +
            '<td class="px-5 py-3">' +
            '<button onclick="event.stopPropagation();openEdit(\'' + escapeHtml(route) + '\')" class="px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 rounded">Edit</button>' +
            (isCustom ? '<button onclick="event.stopPropagation();deleteEntry()" class="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded ml-1">Reset</button>' : '') +
            '</td>' +
            '</tr>';
    }).join('');
}

function openEdit(route) {
    var defaults = seoDefaults[route] || {};
    var saved = seoEntries[route] || {};

    document.getElementById('editId').value = saved._id || '';
    document.getElementById('editRoute').value = route;
    document.getElementById('editTitle').value = saved.title || '';
    document.getElementById('editDescription').value = saved.description || '';
    document.getElementById('editActive').checked = saved.isActive !== undefined ? saved.isActive : true;
    document.getElementById('editNoindex').checked = saved.noindex || false;
    document.getElementById('editCanonical').value = saved.canonical || '';
    document.getElementById('editHeaderHtml').value = saved.headerHtml || '';
    document.getElementById('editBodyTopHtml').value = saved.bodyTopHtml || '';
    document.getElementById('editBodyBottomHtml').value = saved.bodyBottomHtml || '';

    var deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) {
        deleteBtn.style.display = saved._id ? 'inline-block' : 'none';
    }

    // Show defaults as placeholders
    document.getElementById('editTitle').placeholder = defaults.title || 'Default title';
    document.getElementById('editDescription').placeholder = defaults.description || 'Default description';

    document.getElementById('editModal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
}

async function saveEntry() {
    var route = document.getElementById('editRoute').value;
    if (!route) return;

    try {
        await axios.post('/api/admin/seo', {
            route: route,
            title: document.getElementById('editTitle').value.trim(),
            description: document.getElementById('editDescription').value.trim(),
            headerHtml: document.getElementById('editHeaderHtml').value,
            bodyTopHtml: document.getElementById('editBodyTopHtml').value,
            bodyBottomHtml: document.getElementById('editBodyBottomHtml').value,
            canonical: document.getElementById('editCanonical').value.trim(),
            noindex: document.getElementById('editNoindex').checked,
            isActive: document.getElementById('editActive').checked
        });
        alertify.success('SEO məlumatları saxlanıldı');
        closeEditModal();
        loadSeoData();
    } catch (err) {
        alertify.error(err.response?.data?.error || 'Xəta baş verdi');
    }
}

async function deleteEntry() {
    var id = document.getElementById('editId').value;
    if (!id) {
        closeEditModal();
        return;
    }
    if (!confirm('SEO məlumatlarını silmək istədiyinizə əminsiniz? Səhifə default dəyərlərə qayıdacaq.')) return;
    try {
        await axios.delete('/api/admin/seo/' + id);
        alertify.success('SEO məlumatları silindi');
        closeEditModal();
        loadSeoData();
    } catch (err) {
        alertify.error(err.response?.data?.error || 'Xəta baş verdi');
    }
}

function escapeHtml(text) {
    if (!text) return '';
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}
