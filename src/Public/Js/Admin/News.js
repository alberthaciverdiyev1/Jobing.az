var deleteNewsId = null;
var newsEditorInstances = {};
var newsPage = 1;
var newsTotalPages = 1;

document.addEventListener('DOMContentLoaded', function() {
    var tbody = document.getElementById('newsTableBody');
    if (tbody) {
        loadNews(1);
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
// LIST NEWS (with pagination)
// ============================================================
function loadNews(page) {
    if (page) newsPage = page;
    axios.get('/api/admin/news?page=' + newsPage + '&limit=15')
        .then(function(res) {
            var data = res.data.news || (Array.isArray(res.data) ? res.data : []);
            var tbody = document.getElementById('newsTableBody');
            var pagination = document.getElementById('newsPagination');
            if (!tbody) return;

            if (!data || data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-5 py-8 text-center text-gray-400">No news found</td></tr>';
                if (pagination) pagination.innerHTML = '';
                return;
            }

            newsTotalPages = res.data.totalPages || 1;

            tbody.innerHTML = data.map(function(item) {
                return '<tr class="border-b hover:bg-gray-50">' +
                    '<td class="px-5 py-3 font-medium text-gray-900 max-w-xs truncate">' + escapeHtml(item.title) + '</td>' +
                    '<td class="px-5 py-3 text-sm text-gray-500">' + escapeHtml(item.category || '-') + '</td>' +
                    '<td class="px-5 py-3 text-sm text-gray-500">' + (item.views || 0) + '</td>' +
                    '<td class="px-5 py-3"><span class="badge ' + (item.isActive ? 'badge-green' : 'badge-red') + '">' + (item.isActive ? 'Active' : 'Inactive') + '</span></td>' +
                    '<td class="px-5 py-3 text-sm">' + (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-') + '</td>' +
                    '<td class="px-5 py-3">' +
                    '<a href="/admin/news/view/' + item._id + '" class="text-blue-600 hover:text-blue-800 text-sm font-medium me-2">View</a>' +
                    '<a href="/admin/news/edit/' + item._id + '" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium me-2">Edit</a>' +
                    '<button onclick="deleteNews(\'' + item._id + '\')" class="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>' +
                    '</td></tr>';
            }).join('');

            // Render pagination
            if (pagination) renderPagination(pagination, newsPage, newsTotalPages);
        })
        .catch(function(err) {
            var tbody = document.getElementById('newsTableBody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="px-5 py-8 text-center text-red-400">Error: ' + err.message + '</td></tr>';
        });
}

function renderPagination(container, current, total) {
    if (total <= 1) { container.innerHTML = ''; return; }
    var html = '<div class="flex items-center justify-center gap-1 py-4">';
    html += '<button onclick="loadNews(' + (current - 1) + ')" class="px-3 py-1.5 text-sm rounded border ' + (current === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50') + '" ' + (current === 1 ? 'disabled' : '') + '>&laquo;</button>';
    for (var i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
        html += '<button onclick="loadNews(' + i + ')" class="px-3 py-1.5 text-sm rounded border ' + (i === current ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 hover:bg-gray-50') + '">' + i + '</button>';
    }
    html += '<button onclick="loadNews(' + (current + 1) + ')" class="px-3 py-1.5 text-sm rounded border ' + (current === total ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50') + '" ' + (current === total ? 'disabled' : '') + '>&raquo;</button>';
    html += '</div>';
    container.innerHTML = html;
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
            loadNews(newsPage);
        })
        .catch(function(err) {
            alert('Error deleting news: ' + err.message);
            closeDeleteModal();
        });
}

// ============================================================
// ADD NEWS
// ============================================================
async function handleAddNews(e) {
    e.preventDefault();
    var imageUrl = document.getElementById('addImageUrl').value || undefined;
    if (!imageUrl) {
        var uploaded = await uploadNewsImage('add');
        if (uploaded) imageUrl = uploaded;
    }
    var payload = {
        title: document.getElementById('addTitle').value,
        title_en: document.getElementById('addTitleEn')?.value || '',
        title_ru: document.getElementById('addTitleRu')?.value || '',
        slug: document.getElementById('addSlug').value || undefined,
        category: document.getElementById('addCategory').value || undefined,
        imageUrl: imageUrl,
        description: getNewsEditorData('addDescription'),
        description_en: document.getElementById('addDescriptionEn')?.value || '',
        description_ru: document.getElementById('addDescriptionRu')?.value || '',
        content: getNewsEditorData('addContent'),
        content_en: document.getElementById('addContentEn')?.value || '',
        content_ru: document.getElementById('addContentRu')?.value || '',
        isActive: document.getElementById('addIsActive').checked
    };

    axios.post('/api/admin/news', payload)
        .then(function() { window.location.href = '/admin/news'; })
        .catch(function(err) { alert('Error saving news: ' + (err.response?.data?.error || err.message)); });
}

// ============================================================
// EDIT NEWS
// ============================================================
async function handleEditNews(e) {
    e.preventDefault();
    var newsId = window.location.pathname.split('/').pop();
    var imageUrl = document.getElementById('editImageUrl').value || undefined;
    if (!imageUrl) {
        var uploaded = await uploadNewsImage('edit');
        if (uploaded) imageUrl = uploaded;
    }
    var payload = {
        title: document.getElementById('editTitle').value,
        title_en: document.getElementById('editTitleEn')?.value || '',
        title_ru: document.getElementById('editTitleRu')?.value || '',
        slug: document.getElementById('editSlug').value || undefined,
        category: document.getElementById('editCategory').value || undefined,
        imageUrl: imageUrl,
        description: getNewsEditorData('editDescription'),
        description_en: document.getElementById('editDescriptionEn')?.value || '',
        description_ru: document.getElementById('editDescriptionRu')?.value || '',
        content: getNewsEditorData('editContent'),
        content_en: document.getElementById('editContentEn')?.value || '',
        content_ru: document.getElementById('editContentRu')?.value || '',
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
