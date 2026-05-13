var deleteNewsId = null;
var newsEditorInstances = {};

document.addEventListener('DOMContentLoaded', function() {
    var tbody = document.getElementById('newsTableBody');
    if (tbody) {
        loadNews();
        var confirmBtn = document.getElementById('confirmDeleteBtn');
        if (confirmBtn) confirmBtn.addEventListener('click', confirmDeleteNews);
    }

    var addForm = document.getElementById('addNewsForm');
    if (addForm) {
        initNewsEditor('addDescription');
        initNewsEditor('addContent');
        addForm.addEventListener('submit', handleAddNews);
    }

    var editForm = document.getElementById('editNewsForm');
    if (editForm) {
        initNewsEditor('editDescription');
        initNewsEditor('editContent');
        editForm.addEventListener('submit', handleEditNews);
    }
});

function initNewsEditor(textareaId) {
    var el = document.getElementById(textareaId);
    if (!el || typeof ClassicEditor === 'undefined') return;
    ClassicEditor.create(el, {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'undo', 'redo']
    }).then(function(editor) {
        newsEditorInstances[textareaId] = editor;
    }).catch(function(err) {
        console.error('CKEditor error for ' + textareaId + ':', err);
    });
}

function getNewsEditorData(textareaId) {
    if (newsEditorInstances[textareaId]) return newsEditorInstances[textareaId].getData();
    return document.getElementById(textareaId)?.value || '';
}

async function uploadNewsImage(prefix) {
    var fileInput = document.getElementById(prefix + 'ImageFile');
    var file = fileInput && fileInput.files[0];
    if (!file) { alert('Please select an image file'); return; }

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
    } catch (err) {
        alert('Error uploading image: ' + (err.response && err.response.data && err.response.data.error ? err.response.data.error : err.message));
    }
}

// ============================================================
// LIST NEWS
// ============================================================
function loadNews() {
    axios.get('/api/admin/news')
        .then(function(res) {
            var data = res.data.news || res.data;
            var tbody = document.getElementById('newsTableBody');
            if (!tbody) return;

            if (!data || data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-5 py-8 text-center text-gray-400">No news found</td></tr>';
                return;
            }

            tbody.innerHTML = data.map(function(item) {
                return '<tr class="border-b hover:bg-gray-50">' +
                    '<td class="px-5 py-3 font-medium text-gray-900 max-w-xs truncate">' + escapeHtml(item.title) + '</td>' +
                    '<td class="px-5 py-3 text-sm text-gray-500">' + escapeHtml(item.category || '-') + '</td>' +
                    '<td class="px-5 py-3 text-sm text-gray-500">' + (item.views || 0) + '</td>' +
                    '<td class="px-5 py-3"><span class="badge ' + (item.isActive ? 'badge-green' : 'badge-red') + '">' + (item.isActive ? 'Active' : 'Inactive') + '</span></td>' +
                    '<td class="px-5 py-3 text-sm">' + (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-') + '</td>' +
                    '<td class="px-5 py-3">' +
                    '<a href="/admin/news/edit/' + item._id + '" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium me-2">Edit</a>' +
                    '<button onclick="deleteNews(\'' + item._id + '\')" class="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>' +
                    '</td></tr>';
            }).join('');
        })
        .catch(function(err) {
            var tbody = document.getElementById('newsTableBody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="px-5 py-8 text-center text-red-400">Error: ' + err.message + '</td></tr>';
        });
}

function deleteNews(id) {
    deleteNewsId = id;
    var modal = document.getElementById('deleteModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
    }
}

function closeDeleteModal() {
    deleteNewsId = null;
    var modal = document.getElementById('deleteModal');
    if (modal) modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
}

function confirmDeleteNews() {
    if (!deleteNewsId) return;
    axios.delete('/api/admin/news/' + deleteNewsId)
        .then(function() {
            closeDeleteModal();
            loadNews();
        })
        .catch(function(err) {
            alert('Error deleting news: ' + err.message);
            closeDeleteModal();
        });
}

// ============================================================
// ADD NEWS
// ============================================================
function handleAddNews(e) {
    e.preventDefault();
    var payload = {
        title: document.getElementById('addTitle').value,
        slug: document.getElementById('addSlug').value || undefined,
        category: document.getElementById('addCategory').value || undefined,
        imageUrl: document.getElementById('addImageUrl').value || undefined,
        description: getNewsEditorData('addDescription'),
        content: getNewsEditorData('addContent'),
        isActive: document.getElementById('addIsActive').checked
    };

    axios.post('/api/admin/news', payload)
        .then(function() { window.location.href = '/admin/news'; })
        .catch(function(err) { alert('Error saving news: ' + (err.response?.data?.error || err.message)); });
}

// ============================================================
// EDIT NEWS
// ============================================================
function handleEditNews(e) {
    e.preventDefault();
    var newsId = window.location.pathname.split('/').pop();
    var payload = {
        title: document.getElementById('editTitle').value,
        slug: document.getElementById('editSlug').value || undefined,
        category: document.getElementById('editCategory').value || undefined,
        imageUrl: document.getElementById('editImageUrl').value || undefined,
        description: getNewsEditorData('editDescription'),
        content: getNewsEditorData('editContent'),
        isActive: document.getElementById('editIsActive').checked
    };

    axios.put('/api/admin/news/' + newsId, payload)
        .then(function() { window.location.href = '/admin/news'; })
        .catch(function(err) { alert('Error updating news: ' + (err.response?.data?.error || err.message)); });
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
