/**
 * CVList.js — Premium Candidate Cards
 * Miniature professional profiles in a responsive card grid
 */

document.addEventListener('DOMContentLoaded', () => {
  window._CVT = window._CVT || {};

  // ====== STATE ======
  const state = {
    page: 1, limit: 24, search: '', skill: '', education: '',
    total: 0, totalPages: 0, busy: false,
    activeEdu: new Set(),
    activeSkills: new Set(),
  };

  // ====== DOM ======
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const dom = {
    search: $('#cv-search'),
    searchClear: $('#search-clear'),
    grid: $('#cv-grid'),
    skeleton: $('#skeleton-grid'),
    pagination: $('#cv-pagination'),
    empty: $('#empty-state'),
    error: $('#cv-error'),
    header: $('#header-count'),
    pageSize: $('#page-size'),
    sidebarSkills: $('#sidebar-skills-list'),
    eduChecks: $$('.edu-filter'),
    skillChecks: $$('.skill-filter'),
    activeFilters: $('#active-filters'),
    clearFilters: $('#active-filters-clear'),
    sidebarClear: $('#sidebar-clear-all'),
    resetBtn: $('#reset-search'),
    retryBtn: $('#retry-load'),
    quickFilters: $$('.quick-filter'),
    availFilters: $$('.availability-filter'),
  };

  // ====== UTILITIES ======
  function esc(t) { if (!t) return ''; var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

  function initials(name) {
    if (!name) return '?';
    return name.split(' ').map(function (w) { return w[0]; }).filter(Boolean).slice(0, 2).join('').toUpperCase();
  }

  function streak(name) {
    if (!name) return 0;
    var h = 0;
    for (var i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return Math.abs(h) % 6;
  }

  var AVATARS = [
    ['#FF6B00','#FF9A44'], ['#059669','#34D399'], ['#2563EB','#60A5FA'],
    ['#7C3AED','#A78BFA'], ['#D97706','#FBBF24'], ['#E11D48','#FB7185'],
  ];

  function timeAgo(d) {
    if (!d) return '';
    var diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
    if (diff === 0) return window._CVT && window._CVT.today || 'Bu gün';
    if (diff === 1) return window._CVT && window._CVT.yesterday || 'Dünən';
    if (diff < 7) return diff + ' ' + (window._CVT && window._CVT.daysAgo || 'gün öncə');
    if (diff < 30) return Math.floor(diff / 7) + ' ' + (window._CVT && window._CVT.weeksAgo || 'həftə öncə');
    return new Date(d).toLocaleDateString(document.documentElement.lang || 'az', { day: 'numeric', month: 'short' });
  }

  function skillYrs(exp) {
    if (exp && exp.years) return exp.years + '+ yr';
    return '';
  }

  // ====== BUILD SKILL FILTERS ======
  function buildSidebarSkills(skills) {
    if (!dom.sidebarSkills) return;
    if (skills.length === 0) { dom.sidebarSkills.innerHTML = ''; return; }
    var html = '';
    skills.sort().forEach(function (s) {
      html += '<label class="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">' +
        '<input type="checkbox" data-skill="' + esc(s) + '" class="skill-filter w-4 h-4 rounded border-gray-300 text-primary-500 accent-[#FF6B00]">' +
        '<span class="text-xs text-gray-600 dark:text-gray-400">' + esc(s) + '</span></label>';
    });
    dom.sidebarSkills.innerHTML = html;
    // Re-bind skill filter events
    dom.skillChecks = $$('.skill-filter');
    bindSkillFilters();
  }

  function collectSkills(cvs) {
    var set = new Set();
    cvs.forEach(function (cv) {
      (cv.skills || []).forEach(function (s) { if (s && s.trim()) set.add(s.trim()); });
    });
    return Array.from(set);
  }

  // ====== RENDER CARDS ======
  function render(cvs) {
    if (!cvs || cvs.length === 0) {
      dom.grid.classList.add('hidden');
      dom.pagination.classList.add('hidden');
      dom.empty.classList.remove('hidden');
      dom.error.classList.add('hidden');
      return;
    }
    dom.empty.classList.add('hidden');
    dom.error.classList.add('hidden');
    dom.grid.classList.remove('hidden');

    var html = '';

    for (var i = 0; i < cvs.length; i++) {
      var cv = cvs[i];
      var name = cv.fullName || (cv.userId ? (cv.userId.name || '') + ' ' + (cv.userId.surname || '') : null) || 'Adsız Namizəd';
      var init = initials(name);
      var av = streak(name);
      var avGrad = AVATARS[av];
      var exp = cv.experience && cv.experience[0];
      var edu = cv.education && cv.education[0];
      var langs = (cv.languages || []).slice(0, 3);
      var skills = (cv.skills || []).slice(0, 5);
      var skillOver = (cv.skills || []).length - 5;
      var summary = cv.summary || '';
      var date = timeAgo(cv.createdAt);
      var role = exp ? exp.position : (cv.title || '');
      var company = exp ? exp.company : null;
      var yrs = exp && exp.years ? exp.years + ' ' + (window._CVT && window._CVT.expYear || 'il') : (cv.experience && cv.experience.length > 0 ? cv.experience.length + ' ' + (window._CVT && window._CVT.expCount || 'təcrübə') : '');
      var city = exp && exp.city ? exp.city : (cv.address || '');

      html += '<div class="candidate-card-enter bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800/80 shadow-sm dark:shadow-gray-900/50 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-gray-900 hover:border-gray-200/60 dark:hover:border-gray-700/60 transition-all duration-300 overflow-hidden" style="animation-delay:' + (i * 60) + 'ms">';

      html += '<div class="flex flex-col min-h-full p-5 sm:p-[22px]"><div class="flex-1">';

      // ====== HEADER: Avatar + Name ======
      html += '<div class="flex items-start gap-3.5 mb-3.5">';
      // Avatar
      html += '<div class="w-[46px] h-[46px] rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm" style="background:linear-gradient(135deg,' + avGrad[0] + ',' + avGrad[1] + ')">' + init + '</div>';
      // Name + badges
      html += '<div class="flex-1 min-w-0 pt-0.5">';
      html += '<div class="flex items-center gap-1.5 flex-wrap">';
      html += '<h3 class="text-sm text-gray-600 dark:text-gray-400 truncate">' + esc(name) + '</h3>';
      html += '<span class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 rounded text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex-shrink-0"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ' + (window._CVT && window._CVT.active || 'Aktiv') + '</span>';
		html += '</div>';
      // Title — prominent
      if (role) {
        html += '<p class="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white mt-0.5 leading-tight">' + esc(role) + (company ? ' <span class="text-gray-400 dark:text-gray-500 font-normal">· ' + esc(company) + '</span>' : '') + '</p>';
      }
      html += '</div>'; // end name area
      html += '</div>'; // end header row

      // ====== LOCATION / EXPERIENCE ======
      html += '<div class="flex items-center gap-3 mb-3 text-xs text-gray-400 dark:text-gray-500 flex-wrap">';
      if (city) html += '<span class="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="text-gray-300 dark:text-gray-600" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> ' + esc(city) + '</span>';
      if (yrs) html += '<span class="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="text-gray-300 dark:text-gray-600" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg> ' + esc(yrs) + '</span>';
		html += '</div>';

      // ====== SUMMARY ======
      if (summary) {
        html += '<p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-3.5">' + esc(summary.slice(0, 140)) + '</p>';
      } else {
        html += '<div class="mb-3.5"></div>';
      }

      // ====== SKILLS ======
      if (skills.length > 0) {
        html += '<div class="flex flex-wrap gap-1.5 mb-3.5">';
        for (var s = 0; s < skills.length; s++) {
          html += '<span class="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-primary-50/60 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-100/40 dark:border-primary-800/40">' + esc(skills[s]) + '</span>';
        }
        if (skillOver > 0) html += '<span class="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">+' + skillOver + '</span>';
			html += '</div>';
      } else {
        html += '<div class="mb-3.5"></div>';
      }

      // ====== EDUCATION + LANGUAGES ======
      html += '<div class="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500 mb-3 flex-wrap">';
      if (edu) html += '<span class="flex items-center gap-1"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="text-gray-300 dark:text-gray-600" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> ' + esc(edu.school || edu.field || '') + '</span>';
      if (langs.length > 0) html += '<span class="flex items-center gap-1"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="text-gray-300 dark:text-gray-600" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> ' + langs.map(function (l) { return l.name || l; }).join(', ') + '</span>';
			html += '</div>';

      html += '<div class="flex items-center gap-3 text-[11px] text-gray-300 dark:text-gray-600 mb-3">';
      if (cv.type === 'uploaded') html += '<span class="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="text-gray-300 dark:text-gray-600" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> ' + (window._CVT && window._CVT.cvUploaded || 'CV yüklənib') + '</span>';
      html += date;
			html += '</div>';

      html += '</div>'; // end flex-1

      // ====== CTA FOOTER (always bottom) ======
      html += '<div class="mt-auto">';
      html += '<a href="/cv-ler/' + cv._id + '" class="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium border border-gray-200/80 dark:border-gray-700/80 text-gray-500 dark:text-gray-400 hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 hover:border-gray-900 dark:hover:border-white transition-all duration-200">';
      html += window._CVT && window._CVT.viewProfile || 'Profili Gör';
      html += '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>';
      html += '</a>';
			html += '</div>';

      html += '</div></div>'; // end flex-col + card
    }

    dom.grid.innerHTML = html;
    renderActiveFilters();
  }

  // ====== ACTIVE FILTERS ======
  function getLabels() {
    var l = [];
    if (state.search) l.push({ t: 'search', label: '"' + state.search + '"', rm: 'window.__CS()' });
    if (state.skill) l.push({ t: 'skill', label: state.skill, rm: 'window.__SK()' });
    state.activeEdu.forEach(function (e) { l.push({ t: 'edu', label: e, rm: 'window.__RE("' + e + '")' }); });
    return l;
  }

  function renderActiveFilters() {
    var labels = getLabels();
    if (labels.length === 0) {
      dom.activeFilters.classList.add('hidden');
      dom.clearFilters.classList.add('hidden');
      return;
    }
    dom.activeFilters.classList.remove('hidden');
    dom.clearFilters.classList.remove('hidden');
    var h = '';
    for (var i = 0; i < labels.length; i++) {
      h += '<span class="filter-chip inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100/80 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">' +
        esc(labels[i].label) +
        '<button onclick="' + labels[i].rm + '" class="w-3.5 h-3.5 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 flex items-center justify-center"><svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg></button></span>';
    }
    dom.activeFilters.innerHTML = h;
  }

  window.__CS = function () { state.search = ''; dom.search.value = ''; dom.searchClear.classList.add('hidden'); state.page = 1; load(); };
  window.__SK = function () { state.skill = ''; unsetQuickFilters(); state.page = 1; load(); };
  window.__RE = function (label) { state.activeEdu.delete(label); syncEdu(); state.page = 1; load(); };

  // ====== PAGINATION ======
  function renderPagination(page, totalPages) {
    if (!totalPages || totalPages <= 1) { dom.pagination.classList.add('hidden'); return; }
    dom.pagination.classList.remove('hidden');

    function makeBtn(p, label, cls) {
      return '<button data-page="' + p + '" class="page-btn inline-flex items-center justify-center min-w-[36px] h-9 px-2 rounded-xl text-sm ' + cls + '">' + label + '</button>';
    }

    var h = '';
    if (page > 1) h += makeBtn(page - 1, '←', 'text-gray-300 hover:text-gray-600');
    var pages = [];
    var start = Math.max(1, page - 2);
    var end = Math.min(totalPages, page + 2);
    if (start > 1) { pages.push(1); if (start > 2) pages.push(null); }
    for (var i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) { if (end < totalPages - 1) pages.push(null); pages.push(totalPages); }
    pages.forEach(function (p) {
      if (p === null) h += '<span class="px-1 text-gray-200 select-none">…</span>';
      else h += makeBtn(p, p, p === page ? 'active' : 'text-gray-300 hover:text-gray-600');
    });
    if (page < totalPages) h += makeBtn(page + 1, '→', 'text-gray-300 hover:text-gray-600');
    dom.pagination.innerHTML = h;
    dom.pagination.querySelectorAll('.page-btn').forEach(function (el) {
      el.addEventListener('click', function () {
        var p = parseInt(el.dataset.page);
        if (p && p !== state.page) { state.page = p; load(); scrollTop(); }
      });
    });
  }

  function scrollTop() { document.querySelector('.max-w-7xl').scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  // ====== LOAD ======
  async function load() {
    if (state.busy) return;
    state.busy = true;

    dom.skeleton.classList.remove('hidden');
    dom.grid.classList.add('hidden');
    dom.empty.classList.add('hidden');
    dom.error.classList.add('hidden');
    dom.pagination.classList.add('hidden');
    dom.header.textContent = window._CVT && window._CVT.loading || 'Yüklənir…';

    try {
      var params = { page: state.page, limit: state.limit };
      if (state.search) params.search = state.search;
      if (state.skill) params.skill = state.skill;
      if (state.activeEdu.size) params.education = Array.from(state.activeEdu)[0];

      var res = await axios.get('/api/public/cvs', { params: params });
      var data = res.data;

      state.total = data.total || 0;
      state.totalPages = data.totalPages || 0;

      var countLabel = window._CVT && (data.total === 1 ? window._CVT.candidate : window._CVT.result) || 'namizəd';
      dom.header.textContent = data.total + ' ' + countLabel;
      dom.skeleton.classList.add('hidden');
      render(data.cvs || []);
      renderPagination(data.page, data.totalPages);

      // Build sidebar skills from first page
      if (data.cvs && data.cvs.length > 0 && !dom.sidebarSkills.dataset.built) {
        var all = collectSkills(data.cvs);
        buildSidebarSkills(all);
        dom.sidebarSkills.dataset.built = '1';
      }
    } catch (err) {
      console.error(err);
      dom.skeleton.classList.add('hidden');
      dom.grid.classList.add('hidden');
      dom.empty.classList.add('hidden');
      dom.error.classList.remove('hidden');
      dom.header.textContent = window._CVT && window._CVT.error || 'Xəta';
    }
    state.busy = false;
  }

  // ====== SEARCH ======
  var searchTimer;
  dom.search.addEventListener('input', function () {
    clearTimeout(searchTimer);
    var val = dom.search.value.trim();
    dom.searchClear.classList.toggle('hidden', !val);
    searchTimer = setTimeout(function () {
      if (val !== state.search) { state.search = val; state.page = 1; load(); }
    }, 280);
  });
  dom.search.addEventListener('keydown', function (e) { if (e.key === 'Escape') dom.search.blur(); });
  dom.searchClear.addEventListener('click', function () {
    dom.search.value = '';
    dom.searchClear.classList.add('hidden');
    if (state.search) { state.search = ''; state.page = 1; load(); }
    dom.search.focus();
  });

  // ====== KEYBOARD ======
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); dom.search.focus(); }
    if (e.key === '/' && ['INPUT', 'TEXTAREA'].indexOf(e.target.tagName) === -1) { e.preventDefault(); dom.search.focus(); }
  });

  // ====== QUICK FILTERS ======
  function unsetQuickFilters() { dom.quickFilters.forEach(function (b) { b.classList.remove('bg-primary-50', 'text-primary-600', 'ring-1', 'ring-primary-200/60', 'hover:bg-primary-50', 'hover:text-primary-600', 'hover:ring-primary-200/60', 'bg-gray-100/70', 'text-gray-500'); b.className = b.className.replace(/(bg-primary-50|text-primary-600|ring-1|ring-primary-200\/60)/g, '').trim() + ' bg-gray-100/70 text-gray-500'; }); }

  dom.quickFilters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var skill = btn.dataset.skill;
      var active = btn.classList.contains('text-primary-600');
      unsetQuickFilters();
      if (!active) {
        btn.className = 'flex-shrink-0 px-2.5 py-1 rounded-md text-[11px] font-medium bg-primary-50 text-primary-600 ring-1 ring-primary-200/60 transition-all duration-200';
        state.skill = skill;
      } else {
        state.skill = '';
      }
      state.page = 1; load();
    });
  });

  // ====== PAGE SIZE ======
  dom.pageSize.addEventListener('change', function () {
    state.limit = parseInt(dom.pageSize.value);
    state.page = 1; load();
  });

  // ====== SKILL FILTERS ======
  function bindSkillFilters() {
    dom.skillChecks = $$('.skill-filter');
    dom.skillChecks.forEach(function (cb) {
      cb.addEventListener('change', function () {
        var skill = cb.dataset.skill;
        if (cb.checked) state.activeSkills.add(skill); else state.activeSkills.delete(skill);
        // Use first selected skill for API
        state.skill = state.activeSkills.size ? Array.from(state.activeSkills)[0] : '';
        state.page = 1; load();
      });
    });
  }
  bindSkillFilters();

  // ====== EDUCATION FILTERS ======
  function syncEdu() { dom.eduChecks.forEach(function (c) { c.checked = state.activeEdu.has(c.dataset.edu); }); }
  dom.eduChecks.forEach(function (cb) {
    cb.addEventListener('change', function () {
      var val = cb.dataset.edu;
      if (cb.checked) state.activeEdu.add(val); else state.activeEdu.delete(val);
      state.page = 1; load();
    });
  });

  // ====== SIDEBAR CLEAR ======
  dom.sidebarClear.addEventListener('click', resetAll);

  // ====== RESET / RETRY ======
  dom.resetBtn.addEventListener('click', resetAll);
  dom.retryBtn.addEventListener('click', function () { state.page = 1; load(); });
  dom.clearFilters.addEventListener('click', resetAll);

  function resetAll() {
    state.search = ''; state.skill = ''; state.page = 1; state.activeEdu.clear(); state.activeSkills.clear();
    dom.search.value = ''; dom.searchClear.classList.add('hidden');
    unsetQuickFilters();
    dom.skillChecks.forEach(function (c) { c.checked = false; });
    dom.eduChecks.forEach(function (c) { c.checked = false; });
    dom.activeFilters.classList.add('hidden');
    dom.clearFilters.classList.add('hidden');
    load();
  }

  // ====== INIT ======
  load();
});
