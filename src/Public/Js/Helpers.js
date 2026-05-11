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
 * Professional job card — clean, minimal, scannable
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
        // ————— COMPACT CARD (homepage grid) —————
        return `<div class="job-card group bg-white border border-gray-100 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:border-gray-200 hover:shadow-sm hover:-translate-y-0.5 active:border-gray-300" data-original-link="${detailLink}">
            <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    <img src="${logoUrl}" alt="${company}" class="w-full h-full object-cover" onerror="${imgError}">
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2">
                        <h3 class="font-medium text-gray-900 text-sm leading-snug line-clamp-2">${title}</h3>
                        ${salaryText ? `<span class="text-xs font-medium text-primary-500 whitespace-nowrap flex-shrink-0">${salaryText}</span>` : ''}
                    </div>
                    <p class="text-xs text-gray-500 mt-0.5">${company}</p>
                    <div class="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                        <span><i class="far fa-calendar mr-1"></i>${postedDate}</span>
                        <span><i class="fas fa-map-marker-alt mr-1"></i>${location || 'Azərbaycan'}</span>
                    </div>
                </div>
            </div>
        </div>`;
    }

    // ————— FULL CARD (vacancies listing) —————
    return `<div class="job-card group bg-white border border-gray-100 rounded-lg p-5 cursor-pointer transition-all duration-200 hover:border-gray-200 hover:shadow-sm hover:-translate-y-0.5 active:border-gray-300" data-original-link="${detailLink}">
        <div class="flex gap-4">
            <div class="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                <img src="${logoUrl}" alt="${company}" class="w-full h-full object-cover" onerror="${imgError}">
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-3 mb-1">
                    <div class="min-w-0">
                        <h3 class="text-base font-semibold text-gray-900 leading-snug line-clamp-2">${title}</h3>
                        <p class="text-sm text-gray-500 mt-0.5">${company}</p>
                    </div>
                    ${salaryText ? `<span class="text-sm font-semibold text-primary-500 whitespace-nowrap flex-shrink-0">${salaryText}</span>` : ''}
                </div>
                <div class="flex items-center gap-4 text-xs text-gray-400 mt-2">
                    <span><i class="far fa-calendar mr-1"></i>${postedDate}</span>
                    <span><i class="fas fa-map-marker-alt mr-1"></i>${location || 'Azərbaycan'}</span>
                </div>
                <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    ${sourceTag}
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
            <div class="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <i class="fas fa-search text-gray-400"></i>
            </div>
            <h3 class="text-base font-semibold text-gray-900 mb-1">Heç bir vakansiya tapılmadı</h3>
            <p class="text-sm text-gray-500">Xahiş edirik filtrləri dəyişib yenidən yoxlayın</p>
        </div>
    </div>`;
}
