import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;

function wrapText(text, maxChars) {
    const words = String(text).split(' ');
    const lines = [];
    let current = '';
    for (const w of words) {
        const next = current ? `${current} ${w}` : w;
        if (next.length <= maxChars) {
            current = next;
        } else {
            if (current) lines.push(current);
            current = w;
        }
    }
    if (current) lines.push(current);
    return lines;
}

function escapeXml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function formatSalary(minSalary, maxSalary) {
    if (minSalary && maxSalary) {
        return `${Number(minSalary).toLocaleString()} ₼ - ${Number(maxSalary).toLocaleString()} ₼`;
    }
    if (minSalary) return `From ${Number(minSalary).toLocaleString()} ₼`;
    if (maxSalary) return `Up to ${Number(maxSalary).toLocaleString()} ₼`;
    return null;
}

function buildSvg(job) {
    const { title, companyName, minSalary, maxSalary, location } = job;
    const titleLines = wrapText(title || 'Vakansiya', 30);
    const salaryText = formatSalary(minSalary, maxSalary);
    const hasSalary = salaryText !== null;

    // Dynamic layout: baseY tracks the current vertical position
    let baseY = 160;

    // Company name
    const companyHtml = companyName
        ? `<text x="60" y="${baseY}" font-family="Arial, sans-serif" font-size="28" fill="#A5B4FC">${escapeXml(companyName)}</text>`
        : '';

    // If company exists, push title down; if no company, title sits higher (centered feel)
    if (companyName) baseY += 55;

    // Title section — when no salary, add extra offset to center vertically
    const titleExtraOffset = hasSalary ? 0 : 50;
    const titleStartY = baseY + 20 + titleExtraOffset;

    const titleElements = titleLines.map((line, i) =>
        `<text x="60" y="${titleStartY + i * 62}" font-family="Arial, sans-serif" font-size="46" font-weight="bold" fill="#FFFFFF">${escapeXml(line)}</text>`
    ).join('\n      ');

    const afterTitle = titleStartY + titleLines.length * 62;

    // Salary section — golden accent bar + text, only when salary data exists
    let salarySection = '';
    if (hasSalary) {
        salarySection = `
      <rect x="60" y="${afterTitle + 20}" width="4" height="50" rx="2" fill="#F59E0B"/>
      <text x="80" y="${afterTitle + 55}" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#F59E0B">${escapeXml(salaryText)}</text>`;
    }

    // Footer — location + brand
    const footerTop = Math.max(afterTitle + 110, CARD_HEIGHT - 150);

    const locationHtml = location
        ? `<text x="60" y="${footerTop}" font-family="Arial, sans-serif" font-size="22" fill="#94A3B8">📍 ${escapeXml(location)}</text>`
        : '';

    return `<svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A5F"/>
      <stop offset="100%" stop-color="#0F1B2D"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#8B5CF6"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="url(#bg)"/>

  <!-- Decorative elements -->
  <circle cx="1050" cy="0" r="350" fill="#1E40AF" opacity="0.15"/>
  <circle cx="950" cy="530" r="280" fill="#3B82F6" opacity="0.08"/>
  <circle cx="100" cy="580" r="200" fill="#4F46E5" opacity="0.1"/>

  <!-- Brand header -->
  <line x1="60" y1="95" x2="180" y2="95" stroke="url(#accent)" stroke-width="4" stroke-linecap="round"/>
  <text x="60" y="82" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#6366F1" letter-spacing="2">JOBING.AZ</text>

  ${companyHtml}

  <!-- Job title -->
  ${titleElements}
  ${salarySection}

  <!-- Location -->
  ${locationHtml}

  <!-- Footer -->
  <text x="60" y="${CARD_HEIGHT - 30}" font-family="Arial, sans-serif" font-size="14" fill="#475569">jobing.az &#8226; Vakansiyalar</text>
</svg>`;
}

const ImageService = {
    /**
     * Generate a 1200x630 PNG vacancy card image.
     * @param {Object} job - { title, companyName, minSalary, maxSalary, location }
     * @returns {Promise<Buffer>} PNG image buffer
     */
    async generateVacancyCard(job) {
        const svg = buildSvg(job);
        return await sharp(Buffer.from(svg)).png().toBuffer();
    },

    /**
     * Ensure the share upload directory exists.
     */
    getShareDir() {
        const dir = path.join(process.cwd(), 'uploads', 'share');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        return dir;
    },

    /**
     * Save the image buffer to disk and return path + public filename.
     * @param {Buffer} buffer - PNG buffer
     * @param {string} jobId - job _id for filename association
     * @returns {{ filepath: string, filename: string }}
     */
    saveShareImage(buffer, jobId) {
        const dir = this.getShareDir();
        const filename = `job-${String(jobId).slice(-8)}-${uuidv4().slice(0, 8)}.png`;
        const filepath = path.join(dir, filename);
        fs.writeFileSync(filepath, buffer);
        return { filepath, filename };
    }
};

export default ImageService;
