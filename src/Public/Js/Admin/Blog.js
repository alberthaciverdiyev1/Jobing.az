document.addEventListener('DOMContentLoaded', () => {
    // Blog list page
    if (document.getElementById('blogsTableBody')) {
        loadBlogs();
    }

    // Add blog form
    if (document.getElementById('addBlogForm')) {
        initAddBlogForm();
    }

    // Edit blog form
    if (document.getElementById('editBlogForm')) {
        initEditBlogForm();
    }
});

// ============================================================
// LIST BLOGS
// ============================================================
async function loadBlogs() {
    try {
        const { data } = await axios.get('/api/admin/blogs');
        const tbody = document.getElementById('blogsTableBody');

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="px-5 py-8 text-center text-gray-400">No blogs found</td></tr>`;
            return;
        }

        tbody.innerHTML = data.map(blog => `
            <tr class="border-b hover:bg-gray-50">
                <td class="px-5 py-3 font-medium text-gray-900 max-w-xs truncate">${escapeHtml(blog.name)}</td>
                <td class="px-5 py-3 text-sm text-gray-500">${blog.slug || '-'}</td>
                <td class="px-5 py-3">
                    <span class="badge ${blog.isActive ? 'badge-green' : 'badge-red'}">${blog.isActive ? 'Active' : 'Inactive'}</span>
                </td>
                <td class="px-5 py-3 text-sm">${blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : '-'}</td>
                <td class="px-5 py-3">
                    <div class="flex items-center gap-2">
                        <a href="/admin/blogs/edit/${blog._id}" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Edit</a>
                        <button onclick="deleteBlog('${blog._id}')" class="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        document.getElementById('blogsTableBody').innerHTML =
            `<tr><td colspan="5" class="px-5 py-8 text-center text-red-400">Error: ${err.message}</td></tr>`;
    }
}

let deleteBlogId = null;

function deleteBlog(id) {
    deleteBlogId = id;
    document.getElementById('deleteModal').classList.remove('hidden');
    document.body.classList.add('modal-open');
}

function closeDeleteModal() {
    deleteBlogId = null;
    document.getElementById('deleteModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

document.addEventListener('DOMContentLoaded', () => {
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', async () => {
            if (!deleteBlogId) return;
            try {
                await axios.delete(`/api/admin/blogs/${deleteBlogId}`);
                closeDeleteModal();
                loadBlogs();
            } catch (err) {
                alert('Error deleting blog: ' + err.message);
                closeDeleteModal();
            }
        });
    }
});

// ============================================================
// ADD BLOG
// ============================================================
function initAddBlogForm() {
    document.getElementById('addBlogForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById('addName').value,
            slug: document.getElementById('addSlug').value || undefined,
            description: document.getElementById('addDescription').value,
            imageUrl: document.getElementById('addImageUrl').value || undefined,
            isActive: document.getElementById('addIsActive').checked
        };

        try {
            await axios.post('/api/admin/blogs', payload);
            window.location.href = '/admin/blogs';
        } catch (err) {
            alert('Error saving blog: ' + (err.response?.data?.error || err.message));
        }
    });
}

// ============================================================
// EDIT BLOG
// ============================================================
function initEditBlogForm() {
    document.getElementById('editBlogForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const blogId = window.location.pathname.split('/').pop();
        const payload = {
            name: document.getElementById('editName').value,
            slug: document.getElementById('editSlug').value || undefined,
            description: document.getElementById('editDescription').value,
            imageUrl: document.getElementById('editImageUrl').value || undefined,
            isActive: document.getElementById('editIsActive').checked
        };

        try {
            await axios.put(`/api/admin/blogs/${blogId}`, payload);
            window.location.href = '/admin/blogs';
        } catch (err) {
            alert('Error updating blog: ' + (err.response?.data?.error || err.message));
        }
    });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
