import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1080;

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
    if (minSalary) return `${Number(minSalary).toLocaleString()} ₼'dən`;
    if (maxSalary) return `${Number(maxSalary).toLocaleString()} ₼'dək`;
    return null;
}

function buildSvg(job) {
    const { title, companyName, minSalary, maxSalary, location } = job;
    const titleLines = wrapText(title || 'Vakansiya', 18);
    const salaryText = formatSalary(minSalary, maxSalary);

    // ======= Resimdeki Renk Paleti =======
    const BG_CREAM = '#F8F4EE';
    const CARD_BG = '#FFFFFF';
    const ORANGE = '#F99236';
    const DARK = '#111111';
    const TEXT_GRAY = '#6B7280';
    const BORDER_COLOR = '#E5E7EB';

    // ======= Kart Boyutları ve Merkezleme =======
    const cx = CARD_WIDTH / 2;
    const cy = CARD_HEIGHT / 2;
    const cardW = 880;
    const cardH = 860;
    const cardX = cx - cardW / 2;
    const cardY = cy - cardH / 2;

    // ======= "İş Var!" ve Başlık =======
    let cursorY = cardY + 240;
    const titleLineH = 64;
    const titleElements = titleLines.map((line, i) =>
        `<text x="${cardX + 50}" y="${cursorY + i * titleLineH}" font-family="'Helvetica Neue', Arial, sans-serif" font-size="52" font-weight="bold" fill="${DARK}" letter-spacing="-1">${escapeXml(line)}</text>`
    ).join('\n      ');

    cursorY += titleLines.length * titleLineH;

    // ======= Lokasyon ve Maaş (Eğer gönderilirse başlığın altına eklenir) =======
    let metaSvg = '';
    if (location) {
        metaSvg += `
        <rect x="${cardX + 50}" y="${cursorY - 15}" width="${location.length * 10 + 30}" height="32" rx="8" fill="#F3F4F6"/>
        <text x="${cardX + 65}" y="${cursorY + 6}" font-family="'Helvetica Neue', Arial, sans-serif" font-size="16" fill="${TEXT_GRAY}">${escapeXml(location)}</text>
        `;
        cursorY += 50;
    }
    if (salaryText) {
        metaSvg += `
        <rect x="${cardX + 50}" y="${cursorY - 15}" width="${salaryText.length * 10 + 30}" height="32" rx="8" fill="${ORANGE}" opacity="0.12"/>
        <text x="${cardX + 65}" y="${cursorY + 6}" font-family="'Helvetica Neue', Arial, sans-serif" font-size="16" font-weight="bold" fill="${ORANGE}">${escapeXml(salaryText)}</text>
        `;
    }

    // ======= Alt Bölüm (Şirket & Buton) =======
    const lineY = cardY + cardH - 150;
    const buttonW = 200;
    const buttonH = 52;
    const buttonX = cardX + cardW - 50 - buttonW;
    const buttonY = lineY + 25;

    return `<svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="15" stdDeviation="20" flood-color="#000000" flood-opacity="0.08"/>
    </filter>
    <filter id="bellShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="5" stdDeviation="8" flood-color="#000000" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="${BG_CREAM}"/>

  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="30" fill="${DARK}" transform="rotate(-6, ${cx}, ${cy})"/>
  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="30" fill="${ORANGE}" transform="rotate(5, ${cx}, ${cy})"/>

  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="30" fill="${CARD_BG}" filter="url(#shadow)"/>

  <rect x="${cardX + cardW - 165}" y="${cardY + 50}" width="125" height="38" rx="19" fill="none" stroke="${BORDER_COLOR}" stroke-width="1.5"/>
  <text x="${cardX + cardW - 115}" y="${cardY + 75}" font-family="'Helvetica Neue', Arial, sans-serif" font-size="16" fill="${TEXT_GRAY}" text-anchor="middle">elə indi!</text>
  <circle cx="${cardX + cardW - 65}" cy="${cardY + 69}" r="8" fill="none" stroke="${TEXT_GRAY}" stroke-width="1.5"/>
  <path d="M${cardX + cardW - 65} ${cardY + 65} v4 h3" fill="none" stroke="${TEXT_GRAY}" stroke-width="1.5"/>

  <text x="${cardX + 50}" y="${cardY + 150}" font-family="'Helvetica Neue', Arial, sans-serif" font-size="38" font-weight="bold" fill="${ORANGE}">İş var!</text>

  ${titleElements}
  ${metaSvg}

  <line x1="${cardX + 50}" y1="${lineY}" x2="${cardX + cardW - 50}" y2="${lineY}" stroke="${BORDER_COLOR}" stroke-width="1.5"/>

  <text x="${cardX + 50}" y="${lineY + 65}" font-family="'Helvetica Neue', Arial, sans-serif" font-size="24" font-weight="bold" fill="${DARK}">${escapeXml(companyName || 'Şirkət')}</text>

  <rect x="${buttonX}" y="${buttonY}" width="${buttonW}" height="${buttonH}" rx="14" fill="${DARK}"/>
  <text x="${buttonX + buttonW / 2}" y="${buttonY + 32}" font-family="'Helvetica Neue', Arial, sans-serif" font-size="18" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Müraciət et</text>

  <path d="M${cx - 10} ${cardY + cardH + 25} L${cx} ${cardY + cardH + 35} L${cx + 10} ${cardY + cardH + 25}" fill="none" stroke="#E5D9CC" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="${cx}" y="${cardY + cardH + 65}" font-family="'Helvetica Neue', Arial, sans-serif" font-size="20" fill="#E5D9CC" font-weight="bold" text-anchor="middle" letter-spacing="1">jobing.az</text>

  <g transform="translate(${cardX + cardW - 50}, ${cardY - 50}) rotate(15) scale(1)" filter="url(#bellShadow)">
    <path d="M40 20 C40 20 20 40 20 75 L10 100 L110 100 L100 75 C100 40 80 20 80 20 C75 10 65 5 60 5 C55 5 45 10 40 20 Z" fill="#FCD34D"/>
    <path d="M60 5 C55 5 45 10 40 20 C40 20 20 40 20 75 L10 100 L60 100 Z" fill="#FBBF24"/>
    <circle cx="60" cy="110" r="14" fill="#D97706"/>
    <path d="M75 35 C65 30 55 30 45 35" stroke="#FFFBEB" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.7"/>
  </g>
</svg>`;
}

const ImageService = {
    async generateVacancyCard(job) {
        const svg = buildSvg(job);
        // Keskinliği artırmak ve parse hatalarını önlemek için yoğunluk ayarlayabiliriz
        return await sharp(Buffer.from(svg), { density: 150 }).png().toBuffer();
    },

    getShareDir() {
        const dir = path.join(process.cwd(), 'uploads', 'share');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        return dir;
    },

    saveShareImage(buffer, jobId) {
        const dir = this.getShareDir();
        const filename = `job-${String(jobId).slice(-8)}-${uuidv4().slice(0, 8)}.png`;
        const filepath = path.join(dir, filename);
        fs.writeFileSync(filepath, buffer);
        return { filepath, filename };
    }
};

export default ImageService;