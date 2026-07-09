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
    if (minSalary && maxSalary && Number(minSalary) === Number(maxSalary)) {
        return `${Number(minSalary).toLocaleString()} ₼`;
    }
    if (minSalary && maxSalary) {
        return `${Number(minSalary).toLocaleString()} ₼ - ${Number(maxSalary).toLocaleString()} ₼`;
    }
    if (minSalary) return `From ${Number(minSalary).toLocaleString()} ₼`;
    if (maxSalary) return `Up to ${Number(maxSalary).toLocaleString()} ₼`;
    return null;
}

function buildSvg(job) {
    const { title, companyName, minSalary, maxSalary, location } = job;
    const titleLines = wrapText(title || 'Vakansiya', 22);
    const salaryText = formatSalary(minSalary, maxSalary);
    const hasSalary = salaryText !== null;

    const LX = 80;
    let cursorY = 160;

    // ======= Brand header =======
    const brandSvg = `
  <text x="${LX}" y="82" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#FF8C00" letter-spacing="3">JOBING.AZ</text>
  <rect x="${LX}" y="90" width="28" height="3" rx="1.5" fill="#FF8C00" opacity="0.4"/>`;

    // ======= Company name =======
    let companySvg = '';
    if (companyName) {
        companySvg = `
  <text x="${LX}" y="${cursorY}" font-family="Arial, sans-serif" font-size="28" fill="#FF8C00" font-weight="600">${escapeXml(companyName)}</text>`;
        cursorY += 52;
    }

    // ======= Title (dynamic vertical centering) =======
    const titleLineH = 72;
    const titleBlockH = titleLines.length * titleLineH;
    const salaryBlockH = hasSalary ? 90 : 0;
    const locBlockH = location ? 45 : 0;
    const bottomH = 80;
    const usedSpace = (companyName ? 40 : 0) + titleBlockH + salaryBlockH + locBlockH + bottomH;
    const extraTop = Math.max(0, (CARD_HEIGHT - usedSpace - 140) / 2);
    if (!companyName) cursorY += extraTop;

    const titleStartY = cursorY;
    const titleElements = titleLines.map((line, i) =>
        `<text x="${LX}" y="${titleStartY + i * titleLineH}" font-family="Arial, sans-serif" font-size="58" font-weight="bold" fill="#1E293B">${escapeXml(line)}</text>`
    ).join('\n      ');

    cursorY = titleStartY + titleBlockH;

    // ======= Salary badge =======
    let salarySvg = '';
    if (hasSalary) {
        salarySvg = `
  <rect x="${LX}" y="${cursorY + 18}" width="5" height="38" rx="2.5" fill="#FF8C00"/>
  <text x="${LX + 20}" y="${cursorY + 48}" font-family="Arial, sans-serif" font-size="34" font-weight="bold" fill="#FF8C00">${escapeXml(salaryText)}</text>`;
        cursorY += 90;
    } else {
        cursorY += 40;
    }

    // ======= Location =======
    let infoSvg = '';
    if (location) {
        infoSvg = `
  <text x="${LX}" y="${cursorY}" font-family="Arial, sans-serif" font-size="24" fill="#64748B">📍 ${escapeXml(location)}</text>`;
    }

    return `<svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAFAF5"/>
      <stop offset="50%" stop-color="#F5F0EB"/>
      <stop offset="100%" stop-color="#FAFAF5"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="url(#bgGrad)"/>

  <!-- Top orange accent bar -->
  <rect x="0" y="0" width="${CARD_WIDTH}" height="5" fill="#FF8C00"/>

  <!-- Subtle decorative circle (bottom-right) -->
  <circle cx="1100" cy="650" r="350" fill="#FF8C00" opacity="0.04"/>
  <circle cx="1050" cy="580" r="220" fill="#CC7000" opacity="0.05"/>

  <!-- Side decorative line -->
  <line x1="0" y1="180" x2="30" y2="180" stroke="#FF8C00" stroke-width="2" opacity="0.08"/>
  <line x1="0" y1="195" x2="18" y2="195" stroke="#FF8C00" stroke-width="2" opacity="0.06"/>

  ${brandSvg}
  ${companySvg}

  <!-- Title -->
  ${titleElements}
  ${salarySvg}

  <!-- Info -->
  ${infoSvg}

  <!-- Footer -->
  <line x1="${LX}" x2="${CARD_WIDTH - LX}" y1="${CARD_HEIGHT - 60}" y2="${CARD_HEIGHT - 60}" stroke="#E2E8F0" stroke-width="1"/>
  <text x="${LX}" y="${CARD_HEIGHT - 30}" font-family="Arial, sans-serif" font-size="14" fill="#94A3B8">jobing.az</text>
  <text x="${CARD_WIDTH - LX}" y="${CARD_HEIGHT - 30}" font-family="Arial, sans-serif" font-size="14" fill="#94A3B8" text-anchor="end">Vakansiyalar</text>
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
