let currentPage = 1;
let editingUserId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    document.getElementById('userForm').addEventListener('submit', handleUserSubmit);
});

async function loadUsers(page = 1) {
    currentPage = page;
    const search = document.getElementById('searchInput')?.value || '';
    const role = document.getElementById('roleFilter')?.value || '';

    try {
        const params = { page, limit: 20 };
        if (search) params.search = search;
        if (role) params.role = role;

        const { data } = await axios.get('/api/admin/users', { params });
        renderUsersTable(data);
    } catch (err) {
        document.getElementById('usersTableBody').innerHTML =
            `<tr><td colspan="7" class="px-5 py-8 text-center text-red-400">Error: ${err.message}</td></tr>`;
    }
}

function renderUsersTable(data) {
    const tbody = document.getElementById('usersTableBody');

    if (!data.users || data.users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="px-5 py-8 text-center text-gray-400">No users found</td></tr>`;
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    tbody.innerHTML = data.users.map(u => `
        <tr class="border-b hover:bg-gray-50 cursor-pointer" onclick="showUserDetail('${u._id}')">
            <td class="px-5 py-3 font-medium text-gray-900">${escapeHtml(u.name)} ${escapeHtml(u.surname || '')}</td>
            <td class="px-5 py-3">${escapeHtml(u.email)}</td>
            <td class="px-5 py-3"><span class="badge ${u.role === 'admin' ? 'badge-purple' : u.role === 'company' ? 'badge-blue' : 'badge-gray'}">${u.role}</span></td>
            <td class="px-5 py-3">${escapeHtml(u.companyName || '-')}</td>
            <td class="px-5 py-3">${u.phone || '-'}</td>
            <td class="px-5 py-3">
                <span class="badge ${u.isActive ? 'badge-green' : 'badge-red'}">${u.isActive ? 'Active' : 'Inactive'}</span>
            </td>
            <td class="px-5 py-3" onclick="event.stopPropagation()">
                <div class="flex items-center gap-2">
                    <button onclick="editUser('${u._id}')" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Edit</button>
                    <button onclick="deleteUser('${u._id}')" class="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');

    document.getElementById('pagination').innerHTML = `
        <span class="text-sm text-gray-500">${data.total} total users</span>
        ${data.totalPages > 1 ? `
        <div class="flex gap-2">
            <button onclick="loadUsers(${data.page - 1})" class="px-3 py-1 text-sm ${data.page <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'} border rounded" ${data.page <= 1 ? 'disabled' : ''}>Prev</button>
            <button onclick="loadUsers(${data.page + 1})" class="px-3 py-1 text-sm ${data.page >= data.totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'} border rounded" ${data.page >= data.totalPages ? 'disabled' : ''}>Next</button>
        </div>` : ''}
    `;
}

function openUserModal() {
    editingUserId = null;
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('userPassword').required = true;
    document.getElementById('userModalTitle').textContent = 'Add User';
    document.getElementById('userModal').classList.remove('hidden');
    document.body.classList.add('modal-open');
}

function closeUserModal() {
    document.getElementById('userModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

async function editUser(id) {
    try {
        const { data } = await axios.get(`/api/admin/users/${id}`);
        editingUserId = id;
        document.getElementById('userModalTitle').textContent = 'Edit User';
        document.getElementById('userId').value = id;
        document.getElementById('userName').value = data.name || '';
        document.getElementById('userSurname').value = data.surname || '';
        document.getElementById('userEmail').value = data.email || '';
        document.getElementById('userPassword').value = '';
        document.getElementById('userPassword').required = false;
        document.getElementById('userRole').value = data.role || 'user';
        document.getElementById('userPhone').value = data.phone || '';
        document.getElementById('userCompanyName').value = data.companyName || '';
        document.getElementById('userModal').classList.remove('hidden');
        document.body.classList.add('modal-open');
    } catch (err) {
        alert('Error loading user: ' + err.message);
    }
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to deactivate this user?')) return;
    try {
        await axios.delete(`/api/admin/users/${id}`);
        loadUsers(currentPage);
    } catch (err) {
        alert('Error deleting user: ' + err.message);
    }
}

async function showUserDetail(id) {
    try {
        const { data } = await axios.get(`/api/admin/users/${id}`);
        const content = document.getElementById('userDetailContent');
        content.innerHTML = `
            <div class="flex items-center gap-3 pb-3 border-b">
                <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">${(data.name || '?').charAt(0)}</div>
                <div>
                    <p class="font-medium text-gray-900">${escapeHtml(data.name)} ${escapeHtml(data.surname || '')}</p>
                    <p class="text-sm text-gray-500">${escapeHtml(data.email)}</p>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3 pt-2">
                <div><span class="text-xs text-gray-500">Role</span><p class="text-sm font-medium">${data.role}</p></div>
                <div><span class="text-xs text-gray-500">Phone</span><p class="text-sm font-medium">${data.phone || '-'}</p></div>
                ${data.companyName ? `<div><span class="text-xs text-gray-500">Company</span><p class="text-sm font-medium">${escapeHtml(data.companyName)}</p></div>` : ''}
                <div><span class="text-xs text-gray-500">Status</span><p class="text-sm font-medium">${data.isActive ? 'Active' : 'Inactive'}</p></div>
                ${data.jobCount !== undefined ? `<div><span class="text-xs text-gray-500">Jobs</span><p class="text-sm font-medium">${data.jobCount}</p></div>` : ''}
                ${data.cvCount !== undefined ? `<div><span class="text-xs text-gray-500">CVs</span><p class="text-sm font-medium">${data.cvCount}</p></div>` : ''}
                <div><span class="text-xs text-gray-500">Joined</span><p class="text-sm font-medium">${data.createdAt ? new Date(data.createdAt).toLocaleDateString() : '-'}</p></div>
            </div>`;
        document.getElementById('userDetailModal').classList.remove('hidden');
        document.body.classList.add('modal-open');
    } catch (err) {
        alert('Error loading user details: ' + err.message);
    }
}

function closeUserDetailModal() {
    document.getElementById('userDetailModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

async function handleUserSubmit(e) {
    e.preventDefault();
    const payload = {
        name: document.getElementById('userName').value,
        surname: document.getElementById('userSurname').value,
        email: document.getElementById('userEmail').value,
        role: document.getElementById('userRole').value,
        phone: document.getElementById('userPhone').value,
        companyName: document.getElementById('userCompanyName').value
    };
    const password = document.getElementById('userPassword').value;
    if (password) payload.password = password;

    try {
        if (editingUserId) {
            await axios.put(`/api/admin/users/${editingUserId}`, payload);
        } else {
            await axios.post('/api/admin/users', payload);
        }
        closeUserModal();
        loadUsers(currentPage);
    } catch (err) {
        alert('Error saving user: ' + (err.response?.data?.error || err.message));
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
