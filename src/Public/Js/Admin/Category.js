let editingCategoryId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    document.getElementById('categoryForm').addEventListener('submit', handleCategorySubmit);
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
                    ${c.logoUrl
                        ? `<img src="${escapeHtml(c.logoUrl)}" alt="logo" class="w-8 h-8 object-contain rounded">`
                        : `<span class="text-gray-300 text-xs">—</span>`
                    }
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
    document.getElementById('categoryLogoUrl').value = '';
    document.getElementById('categoryModalTitle').textContent = 'Add Category';
    document.getElementById('categoryModal').classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.getElementById('logoUploadSection').classList.add('hidden');
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
        document.getElementById('categoryLogoUrl').value = data.logoUrl || '';
        document.getElementById('categoryModal').classList.remove('hidden');
        document.body.classList.add('modal-open');

        // Show logo upload section
        const logoSection = document.getElementById('logoUploadSection');
        logoSection.classList.remove('hidden');
        const preview = document.getElementById('logoPreview');
        const removeBtn = document.getElementById('removeLogoBtn');
        if (data.logoUrl) {
            preview.src = data.logoUrl;
            preview.classList.remove('hidden');
            removeBtn.classList.remove('hidden');
        } else {
            preview.classList.add('hidden');
            removeBtn.classList.add('hidden');
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
        helloJobAz: document.getElementById('helloJobAz').value
    };

    try {
        if (editingCategoryId) {
            await axios.put(`/api/admin/categories/${editingCategoryId}`, payload);
        } else {
            const response = await axios.post('/api/admin/categories', payload);
            // If created with logo, upload it
            const logoFile = document.getElementById('logoInput').files[0];
            if (logoFile && response.data._id) {
                await uploadLogoForCategory(response.data._id, logoFile);
            }
        }
        closeCategoryModal();
        loadCategories();
    } catch (err) {
        alert('Error saving category: ' + err.message);
    }
}

async function uploadCategoryLogo(input) {
    const file = input.files[0];
    if (!file) return;

    if (!editingCategoryId) {
        // Show preview only, upload happens after save
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById('logoPreview');
            preview.src = e.target.result;
            preview.classList.remove('hidden');
            document.getElementById('removeLogoBtn').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
        return;
    }

    await uploadLogoForCategory(editingCategoryId, file);
}

async function uploadLogoForCategory(categoryId, file) {
    const formData = new FormData();
    formData.append('logo', file);
    try {
        const { data } = await axios.post(`/api/admin/categories/${categoryId}/upload-logo`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        document.getElementById('categoryLogoUrl').value = data.logoUrl;
        const preview = document.getElementById('logoPreview');
        preview.src = data.logoUrl;
        preview.classList.remove('hidden');
        document.getElementById('removeLogoBtn').classList.remove('hidden');
    } catch (err) {
        alert('Error uploading logo: ' + err.message);
    }
}

function removeCategoryLogo() {
    document.getElementById('logoPreview').classList.add('hidden');
    document.getElementById('removeLogoBtn').classList.add('hidden');
    document.getElementById('logoInput').value = '';
    document.getElementById('categoryLogoUrl').value = '';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
