let editingSiteId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadSites();
    document.getElementById('siteForm').addEventListener('submit', handleSiteSubmit);
});

async function loadSites() {
    try {
        const { data } = await axios.get('/api/admin/sites');
        const tbody = document.getElementById('sitesTableBody');

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="px-5 py-8 text-center text-gray-400">No sites found</td></tr>`;
            return;
        }

        tbody.innerHTML = data.map(s => `
            <tr class="border-b hover:bg-gray-50">
                <td class="px-5 py-3 font-medium text-gray-900">${escapeHtml(s.name)}</td>
                <td class="px-5 py-3">${s.url ? `<a href="${s.url}" target="_blank" class="text-indigo-600 hover:underline text-sm">${s.url}</a>` : '-'}</td>
                <td class="px-5 py-3">
                    <span class="badge ${s.isActive ? 'badge-green' : 'badge-red'}">${s.isActive ? 'Active' : 'Inactive'}</span>
                </td>
                <td class="px-5 py-3">
                    <div class="flex items-center gap-2">
                        <button onclick="editSite('${s._id}')" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Edit</button>
                        <button onclick="deleteSite('${s._id}')" class="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        document.getElementById('sitesTableBody').innerHTML =
            `<tr><td colspan="4" class="px-5 py-8 text-center text-red-400">Error: ${err.message}</td></tr>`;
    }
}

function openSiteModal() {
    editingSiteId = null;
    document.getElementById('siteForm').reset();
    document.getElementById('siteId').value = '';
    document.getElementById('siteModalTitle').textContent = 'Add Site';
    document.getElementById('siteModal').classList.remove('hidden');
    document.body.classList.add('modal-open');
}

function closeSiteModal() {
    document.getElementById('siteModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

async function editSite(id) {
    try {
        const { data } = await axios.get(`/api/admin/sites/${id}`);
        editingSiteId = id;
        document.getElementById('siteModalTitle').textContent = 'Edit Site';
        document.getElementById('siteId').value = id;
        document.getElementById('siteName').value = data.name || '';
        document.getElementById('siteUrl').value = data.url || '';
        document.getElementById('siteIcon').value = data.icon || '';
        document.getElementById('siteIsActive').checked = data.isActive !== false;
        document.getElementById('siteModal').classList.remove('hidden');
        document.body.classList.add('modal-open');
    } catch (err) {
        alert('Error loading site: ' + err.message);
    }
}

async function deleteSite(id) {
    if (!confirm('Are you sure you want to delete this site?')) return;
    try {
        await axios.delete(`/api/admin/sites/${id}`);
        loadSites();
    } catch (err) {
        alert('Error deleting site: ' + err.message);
    }
}

async function handleSiteSubmit(e) {
    e.preventDefault();
    const payload = {
        name: document.getElementById('siteName').value,
        url: document.getElementById('siteUrl').value,
        icon: document.getElementById('siteIcon').value,
        isActive: document.getElementById('siteIsActive').checked
    };

    try {
        if (editingSiteId) {
            await axios.put(`/api/admin/sites/${editingSiteId}`, payload);
        } else {
            await axios.post('/api/admin/sites', payload);
        }
        closeSiteModal();
        loadSites();
    } catch (err) {
        alert('Error saving site: ' + err.message);
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
