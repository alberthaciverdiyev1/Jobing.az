async function triggerScrape(type) {
    const statusEl = document.getElementById('scrapeStatus');
    statusEl.innerHTML = '<span class="text-indigo-600">Processing...</span>';

    try {
        let url;
        if (type === 'all') url = '/api/admin/scrape/all';
        else if (type === 'main') url = '/api/admin/scrape/main';
        else url = '/api/admin/scrape/cancel';

        const { data } = await axios.post(url);
        statusEl.innerHTML = `<span class="text-green-600">${data.message || 'Success!'}</span>`;
    } catch (err) {
        statusEl.innerHTML = `<span class="text-red-600">${err.response?.data?.error || err.message}</span>`;
    }
}
