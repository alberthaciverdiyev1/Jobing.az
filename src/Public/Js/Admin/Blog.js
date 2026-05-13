var blogEditorInstance = null;
var deleteBlogId = null;

document.addEventListener('DOMContentLoaded', function() {
    var tbody = document.getElementById('blogsTableBody');
    if (tbody) {
        loadBlogs();
        var confirmBtn = document.getElementById('confirmDeleteBtn');
        if (confirmBtn) confirmBtn.addEventListener('click', confirmDeleteBlog);
    }

    var addForm = document.getElementById('addBlogForm');
    if (addForm) {
        initBlogEditor('addDescription');
        addForm.addEventListener('submit', handleAddBlog);
    }

    var editForm = document.getElementById('editBlogForm');
    if (editForm) {
        initBlogEditor('editDescription');
        editForm.addEventListener('submit', handleEditBlog);
    }
});

function initBlogEditor(textareaId) {
    var el = document.querySelector('#' + textareaId);
    if (!el) return;
    if (typeof ClassicEditor !== 'undefined') {
        if (blogEditorInstance) {
            blogEditorInstance.destroy();
            blogEditorInstance = null;
        }
        ClassicEditor.create(el, {
            toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'undo', 'redo']
        }).then(function(editor) {
            blogEditorInstance = editor;
        }).catch(function(err) {
            console.error('CKEditor error:', err);
        });
    }
}

function getBlogEditorData() {
    if (blogEditorInstance) return blogEditorInstance.getData();
    return '';
}

function destroyBlogEditor() {
    if (blogEditorInstance) {
        blogEditorInstance.destroy();
        blogEditorInstance = null;
    }
}

async function uploadBlogImage(prefix) {
    var fileInput = document.getElementById(prefix + 'ImageFile');
    var file = fileInput && fileInput.files[0];
    if (!file) return;

    var formData = new FormData();
    formData.append('image', file);

    try {
        var { data } = await axios.post('/api/admin/blogs/upload-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        document.getElementById(prefix + 'ImageUrl').value = data.url;
        var preview = document.getElementById(prefix + 'ImagePreview');
        var previewImg = document.getElementById(prefix + 'ImagePreviewImg');
        if (preview && previewImg) {
            preview.classList.remove('hidden');
            previewImg.src = data.url;
        }
        return data.url;
    } catch (err) {
        alert('Error uploading image: ' + (err.response && err.response.data && err.response.data.error ? err.response.data.error : err.message));
    }
}

// ============================================================
// LIST BLOGS
// ============================================================
function loadBlogs() {
    axios.get('/api/admin/blogs')
        .then(function(res) {
            var data = res.data;
            var tbody = document.getElementById('blogsTableBody');
            if (!tbody) return;

            if (!data || data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="px-5 py-8 text-center text-gray-400">No blogs found</td></tr>';
                return;
            }

            tbody.innerHTML = data.map(function(blog) {
                return '<tr class="border-b hover:bg-gray-50">' +
                    '<td class="px-5 py-3 font-medium text-gray-900 max-w-xs truncate">' + escapeHtml(blog.name) + '</td>' +
                    '<td class="px-5 py-3 text-sm text-gray-500">' + (blog.slug || '-') + '</td>' +
                    '<td class="px-5 py-3"><span class="badge ' + (blog.isActive ? 'badge-green' : 'badge-red') + '">' + (blog.isActive ? 'Active' : 'Inactive') + '</span></td>' +
                    '<td class="px-5 py-3 text-sm">' + (blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : '-') + '</td>' +
                    '<td class="px-5 py-3">' +
                    '<a href="/admin/blogs/edit/' + blog._id + '" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium me-2">Edit</a>' +
                    '<button onclick="deleteBlog(\'' + blog._id + '\')" class="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>' +
                    '</td></tr>';
            }).join('');
        })
        .catch(function(err) {
            var tbody = document.getElementById('blogsTableBody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="px-5 py-8 text-center text-red-400">Error: ' + err.message + '</td></tr>';
        });
}

function deleteBlog(id) {
    deleteBlogId = id;
    var modal = document.getElementById('deleteModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
    }
}

function closeDeleteModal() {
    deleteBlogId = null;
    var modal = document.getElementById('deleteModal');
    if (modal) modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
}

function confirmDeleteBlog() {
    if (!deleteBlogId) return;
    axios.delete('/api/admin/blogs/' + deleteBlogId)
        .then(function() {
            closeDeleteModal();
            loadBlogs();
        })
        .catch(function(err) {
            alert('Error deleting blog: ' + err.message);
            closeDeleteModal();
        });
}

// ============================================================
// ADD BLOG
// ============================================================
async function handleAddBlog(e) {
    e.preventDefault();
    // Auto-upload image if file selected and no URL entered yet
    var imageUrl = document.getElementById('addImageUrl').value || undefined;
    if (!imageUrl) {
        var uploaded = await uploadBlogImage('add');
        if (uploaded) imageUrl = uploaded;
    }
    var payload = {
        name: document.getElementById('addName').value,
        slug: document.getElementById('addSlug').value || undefined,
        description: getBlogEditorData() || document.getElementById('addDescription').value,
        imageUrl: imageUrl,
        isActive: document.getElementById('addIsActive').checked
    };

    axios.post('/api/admin/blogs', payload)
        .then(function() { window.location.href = '/admin/blogs'; })
        .catch(function(err) { alert('Error saving blog: ' + (err.response?.data?.error || err.message)); });
}

// ============================================================
// EDIT BLOG
// ============================================================
async function handleEditBlog(e) {
    e.preventDefault();
    var blogId = window.location.pathname.split('/').pop();
    // Auto-upload image if file selected and no URL entered yet
    var imageUrl = document.getElementById('editImageUrl').value || undefined;
    if (!imageUrl) {
        var uploaded = await uploadBlogImage('edit');
        if (uploaded) imageUrl = uploaded;
    }
    var payload = {
        name: document.getElementById('editName').value,
        slug: document.getElementById('editSlug').value || undefined,
        description: getBlogEditorData() || document.getElementById('editDescription').value,
        imageUrl: imageUrl,
        isActive: document.getElementById('editIsActive').checked
    };

    axios.put('/api/admin/blogs/' + blogId, payload)
        .then(function() { window.location.href = '/admin/blogs'; })
        .catch(function(err) { alert('Error updating blog: ' + (err.response?.data?.error || err.message)); });
}

// ============================================================
// UTILITY
// ============================================================
function escapeHtml(text) {
    if (!text) return '';
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}
