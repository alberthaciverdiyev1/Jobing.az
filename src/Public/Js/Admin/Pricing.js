let editingPlanId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadPlans();
    document.getElementById('pricingForm').addEventListener('submit', handlePlanSubmit);
});

async function loadPlans() {
    try {
        const { data } = await axios.get('/api/admin/pricing');
        const tbody = document.getElementById('pricingBody');

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="px-5 py-8 text-center text-gray-400">Heç bir plan tapılmadı</td></tr>`;
            return;
        }

        tbody.innerHTML = data.map(p => `
            <tr class="border-b hover:bg-gray-50">
                <td class="px-5 py-3 font-medium text-gray-900">${escapeHtml(p.name)}</td>
                <td class="px-5 py-3">${p.price} AZN</td>
                <td class="px-5 py-3">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${p.type === 'premium' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}">
                        ${p.type === 'premium' ? 'Premium' : 'İrəli Çək'}
                    </span>
                </td>
                <td class="px-5 py-3">
                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        ${p.duration === 'daily' ? 'Günlük' : 'Aylıq'}
                    </span>
                </td>
                <td class="px-5 py-3">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                        ${p.isActive ? 'Aktiv' : 'Deaktiv'}
                    </span>
                </td>
                <td class="px-5 py-3">
                    <div class="flex items-center gap-2">
                        <button onclick="editPlan('${p._id}')" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Redaktə</button>
                        <button onclick="deletePlan('${p._id}')" class="text-red-600 hover:text-red-800 text-sm font-medium">Sil</button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        document.getElementById('pricingBody').innerHTML =
            `<tr><td colspan="6" class="px-5 py-8 text-center text-red-400">Xəta: ${err.message}</td></tr>`;
    }
}

function openPlanModal() {
    editingPlanId = null;
    document.getElementById('pricingForm').reset();
    document.getElementById('planId').value = '';
    document.getElementById('planActive').checked = true;
    document.getElementById('pricingModalTitle').textContent = 'Plan Əlavə Et';
    document.getElementById('pricingModal').classList.remove('hidden');
    document.body.classList.add('modal-open');
}

function closePlanModal() {
    document.getElementById('pricingModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

async function editPlan(id) {
    try {
        const { data } = await axios.get(`/api/admin/pricing/${id}`);
        editingPlanId = id;
        document.getElementById('pricingModalTitle').textContent = 'Planı Redaktə Et';
        document.getElementById('planId').value = id;
        document.getElementById('planName').value = data.name || '';
        document.getElementById('planPrice').value = data.price || '';
        document.getElementById('planType').value = data.type || '';
        document.getElementById('planDuration').value = data.duration || '';
        document.getElementById('planActive').checked = data.isActive !== false;
        document.getElementById('pricingModal').classList.remove('hidden');
        document.body.classList.add('modal-open');
    } catch (err) {
        alert('Plan yüklənərkən xəta: ' + err.message);
    }
}

async function deletePlan(id) {
    if (!confirm('Bu planı silmək istədiyinizə əminsiniz?')) return;
    try {
        await axios.delete(`/api/admin/pricing/${id}`);
        loadPlans();
    } catch (err) {
        alert('Plan silinərkən xəta: ' + err.message);
    }
}

async function handlePlanSubmit(e) {
    e.preventDefault();
    const payload = {
        name: document.getElementById('planName').value,
        price: Number(document.getElementById('planPrice').value),
        type: document.getElementById('planType').value,
        duration: document.getElementById('planDuration').value,
        isActive: document.getElementById('planActive').checked
    };

    try {
        if (editingPlanId) {
            await axios.put(`/api/admin/pricing/${editingPlanId}`, payload);
        } else {
            await axios.post('/api/admin/pricing', payload);
        }
        closePlanModal();
        loadPlans();
    } catch (err) {
        alert('Plan yadda saxlanılarkən xəta: ' + err.message);
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
