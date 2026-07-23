/**
 * Simple in-memory cache with TTL support.
 * Used for caching SEO data, cities, categories — data that changes infrequently.
 */
const store = new Map();

const Cache = {
    get(key) {
        const entry = store.get(key);
        if (!entry) return undefined;
        if (entry.expiry && Date.now() > entry.expiry) {
            store.delete(key);
            return undefined;
        }
        return entry.value;
    },

    set(key, value, ttlSeconds = 300) {
        store.set(key, {
            value,
            expiry: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null
        });
    },

    delete(key) {
        store.delete(key);
    },

    clear() {
        store.clear();
    }
};

export default Cache;
