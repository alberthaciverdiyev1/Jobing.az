let editingCategoryId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    document.getElementById('categoryForm').addEventListener('submit', handleCategorySubmit);
    document.getElementById('categoryIcon').addEventListener('input', function() {
        const val = this.value.trim();
        const wrap = document.getElementById('iconPreviewWrap');
        const preview = document.getElementById('categoryIconPreview');
        if (val) {
            preview.className = 'fas ' + val + ' text-gray-600 text-xl';
            wrap.classList.remove('hidden');
        } else {
            wrap.classList.add('hidden');
        }
    });
});

async function loadCategories() {
    try {
        const { data } = await axios.get('/api/admin/categories');
        const tbody = document.getElementById('categoryBody');

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="px-5 py-8 text-center text-gray-400">No categories found</td></tr>`;
            return;
        }

        tbody.innerHTML = data.map(c => `
            <tr class="border-b hover:bg-gray-50">
                <td class="px-5 py-3">
                    <i class="fas ${c.icon || 'fa-folder'} text-gray-500 text-lg"></i>
                </td>
                <td class="px-5 py-3 font-medium text-gray-900">${escapeHtml(c.categoryName)}</td>
                <td class="px-5 py-3">${c.bossAz || '-'}</td>
                <td class="px-5 py-3">${c.smartJobAz || '-'}</td>
                <td class="px-5 py-3">${c.offerAz || '-'}</td>
                <td class="px-5 py-3">${c.jobSearch || '-'}</td>
                <td class="px-5 py-3">${c.helloJobAz || '-'}</td>
                <td class="px-5 py-3">
                    <div class="flex items-center gap-2">
                        <button onclick="editCategory('${c._id}')" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Edit</button>
                        <button onclick="deleteCategory('${c._id}')" class="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        document.getElementById('categoryBody').innerHTML =
            `<tr><td colspan="8" class="px-5 py-8 text-center text-red-400">Error: ${err.message}</td></tr>`;
    }
}

function openCategoryModal() {
    editingCategoryId = null;
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryModalTitle').textContent = 'Add Category';
    document.getElementById('categoryModal').classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.getElementById('iconPreviewWrap').classList.add('hidden');
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

async function editCategory(id) {
    try {
        const { data } = await axios.get(`/api/admin/categories/${id}`);
        editingCategoryId = id;
        document.getElementById('categoryModalTitle').textContent = 'Edit Category';
        document.getElementById('categoryId').value = id;
        document.getElementById('categoryName').value = data.categoryName || '';
        document.getElementById('bossAz').value = data.bossAz || '';
        document.getElementById('smartJobAz').value = data.smartJobAz || '';
        document.getElementById('offerAz').value = data.offerAz || '';
        document.getElementById('jobSearch').value = data.jobSearch || '';
        document.getElementById('helloJobAz').value = data.helloJobAz || '';
        document.getElementById('categoryIcon').value = data.icon || '';
        document.getElementById('categoryModal').classList.remove('hidden');
        document.body.classList.add('modal-open');

        const wrap = document.getElementById('iconPreviewWrap');
        const preview = document.getElementById('categoryIconPreview');
        if (data.icon) {
            preview.className = 'fas ' + data.icon + ' text-gray-600 text-xl';
            wrap.classList.remove('hidden');
        } else {
            wrap.classList.add('hidden');
        }
    } catch (err) {
        alert('Error loading category: ' + err.message);
    }
}

async function deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
        await axios.delete(`/api/admin/categories/${id}`);
        loadCategories();
    } catch (err) {
        alert('Error deleting category: ' + err.message);
    }
}

async function handleCategorySubmit(e) {
    e.preventDefault();
    const payload = {
        categoryName: document.getElementById('categoryName').value,
        bossAz: document.getElementById('bossAz').value,
        smartJobAz: document.getElementById('smartJobAz').value,
        offerAz: document.getElementById('offerAz').value,
        jobSearch: document.getElementById('jobSearch').value,
        helloJobAz: document.getElementById('helloJobAz').value,
        icon: document.getElementById('categoryIcon').value.trim() || 'fa-folder'
    };

    try {
        if (editingCategoryId) {
            await axios.put(`/api/admin/categories/${editingCategoryId}`, payload);
        } else {
            await axios.post('/api/admin/categories', payload);
        }
        closeCategoryModal();
        loadCategories();
    } catch (err) {
        alert('Error saving category: ' + err.message);
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
