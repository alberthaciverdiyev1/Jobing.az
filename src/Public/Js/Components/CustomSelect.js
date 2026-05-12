/**
 * CustomSelect — lightweight Select2 alternative
 * Replaces a native <select> with a searchable dropdown.
 *
 * Usage:
 *   const sel = createCustomSelect(document.getElementById('city-select'));
 *   sel.refresh(); // call after dynamically changing <option>s
 *   sel.destroy(); // cleanup
 */
export function createCustomSelect(selectEl) {
    if (!selectEl || selectEl.dataset.customSelect) return null;

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select-wrapper relative';

    // Trigger button
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className =
        'custom-select-trigger w-full flex items-center justify-between gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-left text-gray-900 cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-300 transition-all';
    trigger.innerHTML = `
        <span class="custom-select-value truncate">${getDisplayText(selectEl)}</span>
        <i class="fas fa-chevron-down text-[10px] text-gray-300 transition-transform duration-200"></i>
    `;

    // Dropdown panel (fixed positioning to avoid ancestor overflow clipping)
    const dropdown = document.createElement('div');
    dropdown.className =
        'custom-select-dropdown fixed z-[70] mt-1 bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-200/30 hidden overflow-hidden';

    // Search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Axtar...';
    searchInput.className =
        'custom-select-search w-full px-3 py-2.5 border-b border-gray-100 text-sm outline-none placeholder:text-gray-300';

    // Options list
    const optionsList = document.createElement('div');
    optionsList.className = 'custom-select-options max-h-[220px] overflow-y-auto custom-scroll';

    // Build initial options
    function getDisplayText(sel) {
        return sel.options[sel.selectedIndex]?.text || sel.options[0]?.text || 'Seçin';
    }

    function buildOptions(filter = '') {
        const q = filter.toLowerCase().trim();
        let html = '';
        for (const opt of selectEl.options) {
            const text = opt.text;
            const val = opt.value;
            if (q && !text.toLowerCase().includes(q)) continue;
            const selected = opt.selected ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50';
            html += `<div class="custom-select-option px-3 py-2.5 text-sm cursor-pointer transition-colors ${selected}" data-value="${val}">${text}</div>`;
        }
        if (!html) {
            html = `<div class="px-3 py-6 text-center text-sm text-gray-400">Nəticə tapılmadı</div>`;
        }
        optionsList.innerHTML = html;
    }

    buildOptions();

    // Append
    dropdown.appendChild(searchInput);
    dropdown.appendChild(optionsList);
    wrapper.appendChild(trigger);
    wrapper.appendChild(dropdown);

    // Insert wrapper before select, move select into wrapper, hide native
    selectEl.parentNode.insertBefore(wrapper, selectEl);
    wrapper.appendChild(selectEl);
    selectEl.classList.add('hidden');
    selectEl.dataset.customSelect = '1';

    // --- Event handlers ---

    let open = false;

    function openDropdown() {
        if (open) return;
        open = true;

        // Position dropdown fixed relative to trigger
        const rect = trigger.getBoundingClientRect();
        dropdown.style.left = rect.left + 'px';
        dropdown.style.top = (rect.bottom + 4) + 'px';
        dropdown.style.width = rect.width + 'px';
        dropdown.style.minWidth = '200px';

        dropdown.classList.remove('hidden');
        trigger.querySelector('.fa-chevron-down').classList.add('rotate-180');
        searchInput.value = '';
        buildOptions();
        searchInput.focus();
    }

    function closeDropdown() {
        if (!open) return;
        open = false;
        dropdown.classList.add('hidden');
        trigger.querySelector('.fa-chevron-down').classList.remove('rotate-180');
    }

    function toggleDropdown() {
        open ? closeDropdown() : openDropdown();
    }

    function selectValue(value, text) {
        selectEl.value = value;
        // Trigger change event on native select
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        trigger.querySelector('.custom-select-value').textContent = text;
        closeDropdown();
    }

    // Trigger click
    trigger.addEventListener('click', toggleDropdown);

    // Search filter
    searchInput.addEventListener('input', () => buildOptions(searchInput.value));

    // Option click via delegation
    optionsList.addEventListener('click', (e) => {
        const opt = e.target.closest('.custom-select-option');
        if (!opt) return;
        selectValue(opt.dataset.value, opt.textContent);
    });

    // Outside click close
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) closeDropdown();
    });

    // Keyboard: Enter on trigger opens, Escape closes
    trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown();
        }
        if (e.key === 'Escape') closeDropdown();
    });

    // Close on scroll to keep fixed positioning consistent
    window.addEventListener('scroll', () => {
        if (open) closeDropdown();
    }, { passive: true });

    // Refresh method (call after dynamically updating options)
    function refresh() {
        const currentVal = selectEl.value;
        buildOptions();
        trigger.querySelector('.custom-select-value').textContent = getDisplayText(selectEl);
        // Restore value if it still exists
        if ([...selectEl.options].some(o => o.value === currentVal)) {
            selectEl.value = currentVal;
        }
    }

    // Destroy method
    function destroy() {
        closeDropdown();
        selectEl.classList.remove('hidden');
        delete selectEl.dataset.customSelect;
        wrapper.parentNode.insertBefore(selectEl, wrapper);
        wrapper.remove();
    }

    // Store instance
    selectEl._customSelectInstance = { refresh, destroy, open: openDropdown, close: closeDropdown };

    return { refresh, destroy };
}

/**
 * Initialize all <select> elements matching a selector.
 * Returns an array of instances.
 */
export function initSelects(selector = 'select.custom-select') {
    const instances = [];
    document.querySelectorAll(selector).forEach(el => {
        const instance = createCustomSelect(el);
        if (instance) instances.push(instance);
    });
    return instances;
}
