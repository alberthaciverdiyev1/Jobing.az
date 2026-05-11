let currentPage = 1;
let currentCategory = '';
const limit = 12;
let isLoading = false;

function createNewsCard(item) {
    const img = item.imageUrl
        ? `<div class="h-48 overflow-hidden bg-gray-100">
            <img src="${item.imageUrl}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.onerror=null;this.src='/Images/DefaultCompany.png'">
           </div>`
        : '';
    const cat = item.category
        ? `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary-50 text-primary-600 border border-primary-100 mb-2">${item.category}</span>`
        : '';
    const date = new Date(item.createdAt).toLocaleDateString('az-AZ');
    return `<a href="/xeberler/${item.slug}" class="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-all hover:shadow-sm flex flex-col">
        ${img}
        <div class="p-4 flex flex-col flex-1">
            ${cat}
            <h3 class="font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary-500 transition-colors">${item.title}</h3>
            <p class="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">${item.description || ''}</p>
            <p class="text-xs text-gray-400 mt-2"><i class="far fa-calendar mr-1"></i>${date} · <i class="far fa-eye mr-1"></i>${item.views || 0} oxunma</p>
        </div>
    </a>`;
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('az-AZ');
}

async function loadNews(reset = true) {
    if (isLoading) return;
    isLoading = true;

    const grid = document.getElementById('news-grid');
    const loadMoreBtn = document.getElementById('news-load-more');
    if (!grid) return;

    if (reset) {
        currentPage = 1;
        grid.innerHTML = `<div class="col-span-full flex items-center justify-center py-20">
            <div class="flex flex-col items-center gap-2">
                <div class="w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
                <span class="text-gray-400 text-sm">Xəbərlər yüklənir...</span>
            </div>
        </div>`;
    }

    try {
        const params = { page: currentPage, limit };
        if (currentCategory) params.category = currentCategory;

        const res = await axios.get('/api/news', { params });
        const { news, total, totalPages } = res.data;

        if (reset) {
            grid.innerHTML = '';
        }

        if (news.length === 0) {
            grid.innerHTML = `<div class="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                <i class="far fa-newspaper text-5xl mb-4"></i>
                <p class="text-lg font-medium">Heç bir xəbər tapılmadı</p>
                <p class="text-sm">Hələ bu kateqoriyada xəbər yoxdur</p>
            </div>`;
            if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
            return;
        }

        news.forEach(item => {
            grid.innerHTML += createNewsCard(item);
        });

        if (loadMoreBtn) {
            if (currentPage >= totalPages) {
                loadMoreBtn.classList.add('hidden');
            } else {
                loadMoreBtn.classList.remove('hidden');
            }
        }
    } catch (err) {
        grid.innerHTML = `<div class="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
            <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
            <p class="text-lg font-medium">Xəbərlər yüklənə bilmədi</p>
            <p class="text-sm">Zəhmət olmasa səhifəni yenidən yükləyin</p>
        </div>`;
        if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
    } finally {
        isLoading = false;
    }
}

window.loadMoreNews = function () {
    currentPage++;
    loadNews(false);
};

document.addEventListener('DOMContentLoaded', function () {
    loadNews(true);

    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.category-btn').forEach(b => {
                b.classList.remove('active', 'bg-primary-500', 'text-white');
                b.classList.add('bg-white', 'border', 'border-gray-200', 'text-gray-600');
            });
            this.classList.add('active', 'bg-primary-500', 'text-white');
            this.classList.remove('bg-white', 'border', 'border-gray-200', 'text-gray-600');

            currentCategory = this.dataset.category;
            loadNews(true);
        });
    });
});
