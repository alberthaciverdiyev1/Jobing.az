import axios from 'axios';
import TelegramBot from '../Helpers/TelegramBot.js';
import ImageService from './ImageService.js';

const API_URL = process.env.API_URL || 'http://localhost:3000';

/**
 * Strip HTML tags and truncate text to a max length.
 */
function cleanText(text, maxLen) {
    if (!text) return '';
    const plain = text.replace(/<[^>]*>/g, '').trim();
    return plain.length > maxLen ? plain.slice(0, maxLen - 3) + '...' : plain;
}

/**
 * Build a uniform caption string from job data.
 */
function buildCaption(job, { withDescription = false, descMax = 200 } = {}) {
    const parts = [
        `📌 ${job.title}`,
        job.companyName ? `🏢 ${job.companyName}` : null,
    ];

    if (job.minSalary || job.maxSalary) {
        const s = job.minSalary && job.maxSalary
            ? `${Number(job.minSalary).toLocaleString()} ₼ - ${Number(job.maxSalary).toLocaleString()} ₼`
            : job.minSalary
                ? `${Number(job.minSalary).toLocaleString()} ₼`
                : `${Number(job.maxSalary).toLocaleString()} ₼`;
        parts.push(`💰 ${s}`);
    }

    if (withDescription && job.description) {
        parts.push('', cleanText(job.description, descMax));
    }

    const link = `🔗 jobing.az/vakansiyalar/${job.slug || job._id}/details`;
    parts.push('', link);

    return parts.filter(Boolean).join('\n');
}

const SocialMediaService = {

    // ----------------------------------------------------------------
    // Telegram
    // ----------------------------------------------------------------
    async shareToTelegram(job, imageBuffer, { chatId } = {}) {
        const targetChat = chatId || '@jobingaz';
        try {
            const caption = buildCaption(job);
            await TelegramBot.sendPhoto(targetChat, imageBuffer, {
                caption,
                parse_mode: 'Markdown'
            });
            return { platform: 'telegram', success: true };
        } catch (error) {
            return { platform: 'telegram', success: false, error: error.message };
        }
    },

    // ----------------------------------------------------------------
    // WhatsApp Cloud API
    // ----------------------------------------------------------------
    async shareToWhatsApp(job, _imageBuffer, imageUrl) {
        const token = process.env.WHATSAPP_TOKEN;
        const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        const recipient = process.env.WHATSAPP_TO;

        if (!token || !phoneNumberId || !recipient) {
            return { platform: 'whatsapp', success: false, error: 'WhatsApp Cloud API not configured (WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_TO)' };
        }

        try {
            const caption = buildCaption(job);
            await axios.post(
                `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: recipient,
                    type: 'image',
                    image: { link: imageUrl, caption }
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return { platform: 'whatsapp', success: true };
        } catch (error) {
            const detail = error.response?.data?.error?.message || error.message;
            return { platform: 'whatsapp', success: false, error: detail };
        }
    },

    // ----------------------------------------------------------------
    // LinkedIn REST API
    // ----------------------------------------------------------------
    async shareToLinkedIn(job) {
        const token = process.env.LINKEDIN_ACCESS_TOKEN;
        const organizationUrn = process.env.LINKEDIN_ORGANIZATION_URN;

        if (!token || !organizationUrn) {
            return { platform: 'linkedin', success: false, error: 'LinkedIn API not configured (LINKEDIN_ACCESS_TOKEN, LINKEDIN_ORGANIZATION_URN)' };
        }

        try {
            const text = buildCaption(job, { withDescription: true, descMax: 300 });
            const jobUrl = `https://jobing.az/vakansiyalar/${job.slug || job._id}/details`;

            await axios.post(
                'https://api.linkedin.com/v2/ugcPosts',
                {
                    author: `urn:li:organization:${organizationUrn}`,
                    lifecycleState: 'PUBLISHED',
                    specificContent: {
                        'com.linkedin.ugc.ShareContent': {
                            shareCommentary: { text },
                            shareMediaCategory: 'ARTICLE',
                            media: [{
                                status: 'READY',
                                originalUrl: jobUrl
                            }]
                        }
                    },
                    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'X-Restli-Protocol-Version': '2.0.0'
                    }
                }
            );
            return { platform: 'linkedin', success: true };
        } catch (error) {
            const detail = error.response?.data?.message || error.message;
            return { platform: 'linkedin', success: false, error: detail };
        }
    },

    // ----------------------------------------------------------------
    // Instagram Graph API
    // ----------------------------------------------------------------
    async shareToInstagram(job, _imageBuffer, imageUrl) {
        const token = process.env.INSTAGRAM_ACCESS_TOKEN;
        const businessId = process.env.INSTAGRAM_BUSINESS_ID;

        if (!token || !businessId) {
            return { platform: 'instagram', success: false, error: 'Instagram Graph API not configured (INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ID)' };
        }

        try {
            const caption = buildCaption(job, { withDescription: true, descMax: 2200 });

            // Step 1: Create media container
            const createRes = await axios.post(
                `https://graph.facebook.com/v22.0/${businessId}/media`,
                { image_url: imageUrl, caption },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const mediaId = createRes.data.id;
            if (!mediaId) {
                return { platform: 'instagram', success: false, error: 'Failed to create media container' };
            }

            // Step 2: Publish the container
            await axios.post(
                `https://graph.facebook.com/v22.0/${businessId}/media_publish`,
                { creation_id: mediaId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            return { platform: 'instagram', success: true };
        } catch (error) {
            const detail = error.response?.data?.error?.message || error.message;
            return { platform: 'instagram', success: false, error: detail };
        }
    },

    // ----------------------------------------------------------------
    // All platforms — generate image once, share everywhere
    // ----------------------------------------------------------------
    /**
     * Generate the vacancy card image and share to all configured platforms.
     * Uses Promise.allSettled so each platform is fully isolated.
     *
     * @param {Object} job - full job document from MongoDB
     * @returns {Promise<Array<{platform: string, success: boolean, error?: string}>>}
     */
    async shareToAll(job) {
        // 1. Generate image
        const imageBuffer = await ImageService.generateVacancyCard(job);

        // 2. Save to disk and build public URL
        const { filename } = ImageService.saveShareImage(imageBuffer, job._id);
        const imageUrl = `${API_URL}/uploads/share/${filename}`;

        // 3. Fire all platforms concurrently
        const promises = [
            this.shareToTelegram(job, imageBuffer),
            this.shareToWhatsApp(job, imageBuffer, imageUrl),
            this.shareToLinkedIn(job),
            this.shareToInstagram(job, imageBuffer, imageUrl)
        ];

        const settled = await Promise.allSettled(promises);

        return settled.map((result, i) => {
            if (result.status === 'fulfilled') return result.value;
            // Should not happen since each method catches, but safeguard
            const names = ['telegram', 'whatsapp', 'linkedin', 'instagram'];
            return { platform: names[i] || 'unknown', success: false, error: result.reason?.message || 'Unknown error' };
        });
    }
};

export default SocialMediaService;
