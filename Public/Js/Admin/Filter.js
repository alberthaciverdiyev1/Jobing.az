// ============================================
// Admin Filters Manager
// Manages filters (categories, cities, education, experience, ...)
// and their options via the /api/filters endpoints.
// ============================================

let editingFilterId = null;
let editingOptionId = null;
let currentOptionFilterId = null;

document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.getElementById('filterForm');
    const optionForm = document.getElementById('optionForm');
    if (filterForm) filterForm.addEventListener('submit', handleFilterSubmit);
    if (optionForm) optionForm.addEventListener('submit', handleOptionSubmit);

    // Close modals on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeFilterModal();
            closeOptionModal();
        }
    });
});

// ============================================
// FILTER CRUD
// ============================================

function openFilterModal() {
    editingFilterId = null;
    document.getElementById('filterForm').reset();
    document.getElementById('filterId').value = '';
    document.getElementById('filterSortOrder').value = '0';
    document.getElementById('filterIsActive').checked = true;
    document.getElementById('filterModalTitle').textContent = 'Yeni Filtre';
    document.getElementById('filterModal').classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    setTimeout(() => document.getElementById('filterKey').focus(), 50);
}

function closeFilterModal() {
    document.getElementById('filterModal').classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

function editFilter(id) {
    const filter = (window.__FILTERS__ || []).find(f => Number(f.id) === Number(id));
    if (!filter) {
        alertify.error('Filtr tapılmadı');
        return;
    }
    editingFilterId = id;
    const name = filter.name || {};
    document.getElementById('filterId').value = id;
    document.getElementById('filterKey').value = filter.key || '';
    document.getElementById('filterNameAz').value = name.az || '';
    document.getElementById('filterNameEn').value = name.en || '';
    document.getElementById('filterNameRu').value = name.ru || '';
    document.getElementById('filterSortOrder').value = filter.sortOrder || 0;
    document.getElementById('filterIsActive').checked = filter.isActive !== false;
    document.getElementById('filterModalTitle').textContent = 'Filtreni Düzəliş Et';
    document.getElementById('filterModal').classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

async function deleteFilter(id) {
    if (!confirm('Bu filtri və bütün seçimlərini silmək istədiyinizə əminsiniz?')) return;
    try {
        await axios.delete(`/api/filters/${id}`);
        alertify.success('Filtr silindi');
        window.location.reload();
    } catch (err) {
        alertify.error(err.response?.data?.message || err.message || 'Silinərkən xəta');
    }
}

async function handleFilterSubmit(e) {
    e.preventDefault();
    const payload = {
        key: document.getElementById('filterKey').value.trim(),
        name: {
            az: document.getElementById('filterNameAz').value.trim(),
            en: document.getElementById('filterNameEn').value.trim(),
            ru: document.getElementById('filterNameRu').value.trim()
        },
        sortOrder: parseInt(document.getElementById('filterSortOrder').value) || 0,
        isActive: document.getElementById('filterIsActive').checked
    };

    if (!payload.key) { alertify.error('Key daxil edin'); return; }
    if (!payload.name.az) { alertify.error('Ad (AZ) daxil edin'); return; }

    try {
        if (editingFilterId) {
            await axios.put(`/api/filters/${editingFilterId}`, payload);
            alertify.success('Filtr yeniləndi');
        } else {
            await axios.post('/api/filters', payload);
            alertify.success('Filtr yaradıldı');
        }
        closeFilterModal();
        window.location.reload();
    } catch (err) {
        alertify.error(err.response?.data?.message || err.message || 'Saxlanarkən xəta');
    }
}

// ============================================
// OPTION CRUD
// ============================================

function openOptionModal(optionId, filterId) {
    editingOptionId = optionId ? Number(optionId) : null;
    currentOptionFilterId = filterId ? Number(filterId) : null;
    document.getElementById('optionForm').reset();
    document.getElementById('optionId').value = editingOptionId || '';
    document.getElementById('optionFilterId').value = currentOptionFilterId || '';
    document.getElementById('optionSortOrder').value = '0';
    document.getElementById('optionIsActive').checked = true;

    if (editingOptionId) {
        const filter = (window.__FILTERS__ || []).find(f => Number(f.id) === currentOptionFilterId);
        const opt = filter?.options?.find(o => Number(o.id) === editingOptionId);
        if (!opt) {
            alertify.error('Seçim tapılmadı');
            return;
        }
        const name = opt.name || {};
        document.getElementById('optionValue').value = opt.value || '';
        document.getElementById('optionNameAz').value = name.az || '';
        document.getElementById('optionNameEn').value = name.en || '';
        document.getElementById('optionNameRu').value = name.ru || '';
        document.getElementById('optionSortOrder').value = opt.sortOrder || 0;
        document.getElementById('optionIsActive').checked = opt.isActive !== false;
        document.getElementById('optionModalTitle').textContent = 'Seçimi Düzəliş Et';
    } else {
        document.getElementById('optionModalTitle').textContent = 'Yeni Seçim';
        setTimeout(() => document.getElementById('optionValue').focus(), 50);
    }

    document.getElementById('optionModal').classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

function closeOptionModal() {
    document.getElementById('optionModal').classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

function editOption(id) {
    // Find which filter this option belongs to
    const filter = (window.__FILTERS__ || []).find(f =>
        (f.options || []).some(o => Number(o.id) === Number(id))
    );
    if (!filter) { alertify.error('Seçim tapılmadı'); return; }
    openOptionModal(id, filter.id);
}

async function deleteOption(id) {
    if (!confirm('Bu seçimi silmək istədiyinizə əminsiniz?')) return;
    try {
        await axios.delete(`/api/filters/options/${id}`);
        alertify.success('Seçim silindi');
        window.location.reload();
    } catch (err) {
        alertify.error(err.response?.data?.message || err.message || 'Silinərkən xəta');
    }
}

async function handleOptionSubmit(e) {
    e.preventDefault();
    const payload = {
        value: document.getElementById('optionValue').value.trim(),
        name: {
            az: document.getElementById('optionNameAz').value.trim(),
            en: document.getElementById('optionNameEn').value.trim(),
            ru: document.getElementById('optionNameRu').value.trim()
        },
        sortOrder: parseInt(document.getElementById('optionSortOrder').value) || 0,
        isActive: document.getElementById('optionIsActive').checked
    };

    if (!payload.value) { alertify.error('Value daxil edin'); return; }
    if (!payload.name.az) { alertify.error('Ad (AZ) daxil edin'); return; }

    try {
        if (editingOptionId) {
            await axios.put(`/api/filters/options/${editingOptionId}`, payload);
            alertify.success('Seçim yeniləndi');
        } else {
            const filterId = document.getElementById('optionFilterId').value;
            if (!filterId) { alertify.error('Filtr seçilməyib'); return; }
            await axios.post(`/api/filters/${filterId}/options`, payload);
            alertify.success('Seçim yaradıldı');
        }
        closeOptionModal();
        window.location.reload();
    } catch (err) {
        alertify.error(err.response?.data?.message || err.message || 'Saxlanarkən xəta');
    }
}

// ============================================
// OPTIONS TOGGLE (expand/collapse)
// ============================================

function toggleOptions(filterId) {
    const body = document.getElementById(`options-${filterId}`);
    const chevron = document.getElementById(`chevron-${filterId}`);
    if (!body) return;
    body.classList.toggle('hidden');
    if (chevron) {
        chevron.classList.toggle('rotate-180');
    }
}
