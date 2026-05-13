import Parser from 'rss-parser';
import slugify from 'slugify';
import News from '../Models/News.js';
import RssSource from '../Models/RssSource.js';

const parser = new Parser();

const RssImportService = {
    /** Fetch and import news from a single RSS source */
    fetchAndImport: async (source) => {
        try {
            const feed = await parser.parseURL(source.url);
            const items = feed.items || [];
            let imported = 0;
            let skipped = 0;

            for (const item of items) {
                const title = item.title?.trim();
                if (!title) continue;

                // Deduplicate by title
                const exists = await News.findOne({ title });
                if (exists) {
                    skipped++;
                    continue;
                }

                const description = item.contentSnippet
                    ? item.contentSnippet.slice(0, 500)
                    : (item.content?.slice(0, 500) || '');

                const content = item.content || item.contentSnippet || '';

                // Generate slug from title
                const slug = slugify(title, { lower: true, strict: true })
                    + '-' + Math.floor(Math.random() * 100000);

                await News.create({
                    title,
                    slug,
                    description,
                    content,
                    imageUrl: item.enclosure?.url
                        || (item['media:content']?.$.url)
                        || '',
                    category: source.category || 'Imported',
                    isActive: false
                });
                imported++;
            }

            // Update last fetched timestamp
            await RssSource.findByIdAndUpdate(source._id, { lastFetchedAt: new Date() });

            return { imported, skipped, total: items.length };
        } catch (error) {
            throw new Error(`RSS import failed for ${source.url}: ${error.message}`);
        }
    },

    /** Import from a single source by ID */
    importSingle: async (sourceId) => {
        const source = await RssSource.findById(sourceId);
        if (!source) throw new Error('RSS source not found');
        return await RssImportService.fetchAndImport(source);
    },

    /** Import from all active sources */
    importAll: async () => {
        const sources = await RssSource.find({ isActive: true });
        const results = [];
        for (const source of sources) {
            try {
                const result = await RssImportService.fetchAndImport(source);
                results.push({ name: source.name || source.url, ...result, success: true });
            } catch (error) {
                results.push({ name: source.name || source.url, success: false, error: error.message });
            }
        }
        return results;
    }
};

export default RssImportService;
