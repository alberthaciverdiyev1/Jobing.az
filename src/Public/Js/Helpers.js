export function capitalizeFirstLetter(text) {
    const specialCharacters = ['-', '_', '.', ',', '!', '?', ':', ';',')','('];

    return text
        .toLowerCase()
        .split(' ')
        .map(word => {
            let newWord = '';
            let capitalizeNext = true;

            for (let char of word) {
                if (capitalizeNext && /\p{L}/u.test(char)) {
                    newWord += char.toUpperCase();
                    capitalizeNext = false;
                } else {
                    newWord += char;
                }

                if (specialCharacters.includes(char)) {
                    capitalizeNext = true;
                }
            }

            return newWord;
        })
        .join(' ');
}

/**
 * Job card — large readable design
 */
export function createJobCard(element, compact = false) {
    let logoUrl = "../Images/DefaultCompany.png";
    if (element.companyImageUrl && element.companyImageUrl !== "/nologo.png") {
        if (element.companyImageUrl.startsWith('http')) {
            logoUrl = element.companyImageUrl;
        } else if (element.companyImageUrl.startsWith('/uploads/')) {
            logoUrl = element.companyImageUrl;
        } else if (element.companyImageUrl.includes('src/Public/')) {
            logoUrl = '../' + element.companyImageUrl.slice(element.companyImageUrl.indexOf('src/Public/') + 11);
        } else {
            logoUrl = element.companyImageUrl.replace(/\\/g, '/');
        }
    }

    const hasMin = element.minSalary != null && !isNaN(+element.minSalary) && +element.minSalary > 0;
    const hasMax = element.maxSalary != null && !isNaN(+element.maxSalary) && +element.maxSalary > 0;
    const salaryText = hasMin || hasMax
        ? (hasMin && hasMax && +element.minSalary === +element.maxSalary
            ? +element.minSalary + " " + element.currencySign
            : (hasMin ? +element.minSalary : '') + (hasMin && hasMax ? ' - ' : '') + (hasMax ? +element.maxSalary + " " + element.currencySign : ''))
        : "Razılaşma Yolu ilə";

    const detailLink = (element.redirectUrl && element.redirectUrl !== "#")
        ? element.redirectUrl
        : `/vakansiyalar/${element.slug || element.uniqueKey || element._id}/details`;

    const postedDate = element.postedAt ? element.postedAt.slice(0, 10) : '';
    const title = capitalizeFirstLetter(element.title);
    const company = capitalizeFirstLetter(element.companyName);
    const location = element.location;
    const defaultImg = "../Images/DefaultCompany.png";
    const imgError = `this.onerror=null;this.src='${defaultImg}'`;

    // Source tag
    const sourceTag = `<span class="text-xs text-gray-400">${element.sourceUrl}</span>`;

    if (compact) {
        // ————— COMPACT CARD (homepage grid, bigger) —————
        return `<div class="job-card group bg-white border border-gray-200 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1 active:border-gray-400" data-original-link="${detailLink}">
            <div class="flex items-start gap-4">
                <div class="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center shadow-sm">
                    <img src="${logoUrl}" alt="${company}" class="w-full h-full object-cover" onerror="${imgError}">
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-3">
                        <h3 class="font-semibold text-gray-900 text-base leading-snug line-clamp-2">${title}</h3>
                        ${salaryText ? `<span class="text-sm font-semibold text-primary-500 whitespace-nowrap flex-shrink-0">${salaryText}</span>` : ''}
                    </div>
                    <p class="text-sm text-gray-500 mt-1 font-medium">${company}</p>
                    <div class="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <span><i class="far fa-calendar mr-1.5"></i>${postedDate}</span>
                        <span><i class="fas fa-map-marker-alt mr-1.5"></i>${location || 'Azərbaycan'}</span>
                    </div>
                </div>
            </div>
        </div>`;
    }

    // ————— FULL CARD (vacancies listing page, bigger) —————
    return `<div class="job-card group bg-white border border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1 active:border-gray-400" data-original-link="${detailLink}">
        <div class="flex gap-5">
            <div class="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center shadow-sm">
                <img src="${logoUrl}" alt="${company}" class="w-full h-full object-cover" onerror="${imgError}">
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-3 mb-1">
                    <div class="min-w-0">
                        <h3 class="text-lg font-bold text-gray-900 leading-snug line-clamp-2">${title}</h3>
                        <p class="text-base text-gray-500 mt-1 font-medium">${company}</p>
                    </div>
                    ${salaryText ? `<span class="text-base font-bold text-primary-500 whitespace-nowrap flex-shrink-0">${salaryText}</span>` : ''}
                </div>
                <div class="flex items-center gap-5 text-sm text-gray-400 mt-2">
                    <span><i class="far fa-calendar mr-1.5"></i>${postedDate}</span>
                    <span><i class="fas fa-map-marker-alt mr-1.5"></i>${location || 'Azərbaycan'}</span>
                </div>
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                    ${sourceTag}
                    <span class="text-xs font-medium text-primary-500 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 -translate-x-2">
                        Ətraflı <i class="fas fa-arrow-right text-[10px] ml-1"></i>
                    </span>
                </div>
            </div>
        </div>
    </div>`;
}

/**
 * Empty state card
 */
export function noDataCard() {
    return `<div class="col-span-full flex items-center justify-center py-16">
        <div class="text-center">
            <div class="w-14 h-14 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i class="fas fa-search text-gray-400 text-lg"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-1">Heç bir vakansiya tapılmadı</h3>
            <p class="text-sm text-gray-500">Xahiş edirik filtrləri dəyişib yenidən yoxlayın</p>
        </div>
    </div>`;
}
