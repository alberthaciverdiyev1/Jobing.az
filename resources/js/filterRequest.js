export async function fetchFilterJson(manager, url) {
    manager.requestController?.abort();
    manager.requestController = new AbortController();
    manager.errorMessage = '';

    try {
        const response = await fetch(url, {
            cache: 'no-store',
            signal: manager.requestController.signal,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (error.name !== 'AbortError') {
            manager.errorMessage = manager.filterErrorMessage || 'Filtrlər yüklənərkən xəta baş verdi.';
            console.error('Filter request failed:', error);
        }
        return null;
    }
}
