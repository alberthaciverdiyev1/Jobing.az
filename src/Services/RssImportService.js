import Parser from 'rss-parser';
import slugify from 'slugify';
import News from '../Models/News.js';
import RssSource from '../Models/RssSource.js';

const parser = new Parser({
    customFields: {
        item: [
            ['content:encoded', 'contentEncoded'],
            ['media:content', 'mediaContent'],
            ['media:thumbnail', 'mediaThumbnail'],
        ],
    }
});

/** Strip HTML tags from text */
function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Extract the best available description from an RSS item */
function extractDescription(item) {
    // Prefer contentSnippet (plain text version of content)
    if (item.contentSnippet) {
        return item.contentSnippet.slice(0, 500);
    }
    // Fallback: content:encoded stripped of HTML
    if (item.contentEncoded) {
        return stripHtml(item.contentEncoded).slice(0, 500);
    }
    // Fallback: content stripped of HTML
    if (item.content) {
        return stripHtml(item.content).slice(0, 500);
    }
    return item.description ? stripHtml(item.description).slice(0, 500) : '';
}

/** Extract the best available full content from an RSS item */
function extractContent(item) {
    // Prefer content:encoded (typically the full article HTML in RSS 2.0)
    if (item.contentEncoded) {
        return item.contentEncoded;
    }
    // Fallback: content field
    if (item.content) {
        return item.content;
    }
    // Fallback: description (might be truncated but better than nothing)
    return item.contentSnippet || item.description || '';
}

/** Extract the best available image from an RSS item */
function extractImage(item) {
    // Try enclosure (podcast/media attachments)
    if (item.enclosure?.url) return item.enclosure.url;

    // Try media:content
    if (item.mediaContent?.$?.url) return item.mediaContent.$.url;

    // Try media:thumbnail
    if (item.mediaThumbnail?.$?.url) return item.mediaThumbnail.$.url;

    return '';
}

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

                const description = extractDescription(item);
                const content = extractContent(item);
                const imageUrl = extractImage(item);

                // Generate slug from title
                const slug = slugify(title, { lower: true, strict: true })
                    + '-' + Math.floor(Math.random() * 100000);

                // Prepare base news data
                const newsData = {
                    title,
                    slug,
                    description: stripHtml(description),
                    content,
                    imageUrl,
                    category: source.category || 'Imported',
                    isActive: false
                };

                await News.create(newsData);
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
