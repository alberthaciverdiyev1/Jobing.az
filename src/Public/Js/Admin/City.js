let editingCityId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadCities();
    document.getElementById('cityForm').addEventListener('submit', handleCitySubmit);
});

async function loadCities() {
    try {
        const { data } = await axios.get('/api/admin/cities');
        const tbody = document.getElementById('citiesTableBody');

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" class="px-5 py-8 text-center text-gray-400">No cities found</td></tr>`;
            return;
        }

        tbody.innerHTML = data.map(c => `
            <tr class="border-b hover:bg-gray-50">
                <td class="px-5 py-3 font-medium text-gray-900">${escapeHtml(c.name)}</td>
                <td class="px-5 py-3">${c.website ? escapeHtml(c.website) : '-'}</td>
                <td class="px-5 py-3">
                    <div class="flex items-center gap-2">
                        <button onclick="editCity('${c._id}')" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Edit</button>
                        <button onclick="deleteCity('${c._id}')" class="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        document.getElementById('citiesTableBody').innerHTML =
            `<tr><td colspan="3" class="px-5 py-8 text-center text-red-400">Error: ${err.message}</td></tr>`;
    }
}

function openCityModal() {
    editingCityId = null;
    document.getElementById('cityForm').reset();
    document.getElementById('cityId').value = '';
    document.getElementById('cityModalTitle').textContent = 'Add City';
    document.getElementById('cityModal').classList.remove('hidden');
    document.body.classList.add('modal-open');
}

function closeCityModal() {
    document.getElementById('cityModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

async function editCity(id) {
    try {
        const { data } = await axios.get(`/api/admin/cities/${id}`);
        editingCityId = id;
        document.getElementById('cityModalTitle').textContent = 'Edit City';
        document.getElementById('cityId').value = id;
        document.getElementById('cityName').value = data.name || '';
        document.getElementById('cityWebsite').value = data.website || '';
        document.getElementById('cityModal').classList.remove('hidden');
        document.body.classList.add('modal-open');
    } catch (err) {
        alert('Error loading city: ' + err.message);
    }
}

async function deleteCity(id) {
    if (!confirm('Are you sure you want to delete this city?')) return;
    try {
        await axios.delete(`/api/admin/cities/${id}`);
        loadCities();
    } catch (err) {
        alert('Error deleting city: ' + err.message);
    }
}

async function handleCitySubmit(e) {
    e.preventDefault();
    const payload = {
        name: document.getElementById('cityName').value,
        website: document.getElementById('cityWebsite').value
    };

    try {
        if (editingCityId) {
            await axios.put(`/api/admin/cities/${editingCityId}`, payload);
        } else {
            await axios.post('/api/admin/cities', payload);
        }
        closeCityModal();
        loadCities();
    } catch (err) {
        alert('Error saving city: ' + err.message);
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
