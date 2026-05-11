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
 * Modern job card — clean, professional, scannable
 */
export function createJobCard(element, compact = false) {
    const logoUrl = (element.companyImageUrl && element.companyImageUrl !== "/nologo.png" && !element.companyImageUrl.startsWith('http'))
        ? element.companyImageUrl.replace(/src\/Public/g, '..')
        : (element.companyImageUrl && element.companyImageUrl.startsWith('http')
            ? element.companyImageUrl
            : "../Images/DefaultCompany.png");

    const hasMin = element.minSalary != null && !isNaN(+element.minSalary) && +element.minSalary > 0;
    const hasMax = element.maxSalary != null && !isNaN(+element.maxSalary) && +element.maxSalary > 0;
    const salaryText = hasMin || hasMax
        ? (hasMin && hasMax && +element.minSalary === +element.maxSalary
            ? +element.minSalary + " " + element.currencySign
            : (hasMin ? +element.minSalary : '') + (hasMin && hasMax ? ' - ' : '') + (hasMax ? +element.maxSalary + " " + element.currencySign : ''))
        : "Razılaşma Yolu ilə";

    const detailLink = (element.redirectUrl && element.redirectUrl !== "#")
        ? element.redirectUrl
        : `/vakansiyalar/${element.uniqueKey || element._id}/details`;

    const postedDate = element.postedAt ? element.postedAt.slice(0, 10) : '';
    const title = capitalizeFirstLetter(element.title);
    const company = capitalizeFirstLetter(element.companyName);
    const location = element.location;
    const defaultImg = "../Images/DefaultCompany.png";
    const imgError = `this.onerror=null;this.src='${defaultImg}'`;

    // Shared meta row: date + location
    const metaHtml = `<div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
        <span class="inline-flex items-center gap-1.5">
            <i class="far fa-calendar text-gray-300"></i>${postedDate}
        </span>
        <span class="text-gray-200 text-[8px]">|</span>
        <span class="inline-flex items-center gap-1.5">
            <i class="fas fa-map-marker-alt text-gray-300"></i>${location || 'Azərbaycan'}
        </span>
    </div>`;

    // Source tag
    const sourceHtml = `<span class="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-medium ${element.sourceUrl === 'jobing' ? 'bg-orange-50 text-orange-700 border border-orange-200/50' : 'bg-blue-50 text-blue-700 border border-blue-200/50'}">
        ${element.sourceUrl}
    </span>`;

    // Premium badge
    const premiumHtml = element.isPremium
        ? `<span class="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-medium bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-200/50"><i class="fas fa-crown text-[9px]"></i> Premium</span>`
        : '';

    if (compact) {
        // ————— COMPACT CARD (homepage grid) —————
        return `<div class="group bg-white rounded-xl border border-gray-100 p-4 cursor-pointer transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg hover:shadow-orange-500/8 hover:border-orange-200 active:scale-[0.99] animate-fade-in-up" data-original-link="${detailLink}">
            <div class="flex items-start gap-3">
                <!-- Logo -->
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center shadow-sm">
                    <img src="${logoUrl}" alt="${company}" class="w-full h-full object-cover" onerror="${imgError}">
                </div>
                <!-- Content -->
                <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2 mb-1">
                        <h3 class="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-primary-500 transition-colors duration-200">${title}</h3>
                        ${salaryText ? `<span class="text-xs font-bold text-primary-500 whitespace-nowrap flex-shrink-0 bg-primary-50/80 px-2 py-0.5 rounded-md">${salaryText}</span>` : ''}
                    </div>
                    <p class="text-xs text-gray-500 mb-1.5 font-medium">${company}</p>
                    <div class="flex flex-wrap items-center gap-2 text-[11px] text-gray-400 mb-2">
                        <span><i class="far fa-calendar mr-0.5 text-gray-300"></i>${postedDate}</span>
                        <span><i class="fas fa-map-marker-alt mr-0.5 text-gray-300"></i>${location || 'Azərbaycan'}</span>
                    </div>
                    <div class="flex items-center gap-1.5 pt-2 border-t border-gray-50">
                        ${sourceHtml}
                        ${premiumHtml}
                    </div>
                </div>
            </div>
        </div>`;
    }

    // ————— FULL CARD (vacancies listing) —————
    return `<div class="group bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 cursor-pointer transition-all duration-300 hover:-translate-y-[3px] hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-200 active:scale-[0.99] animate-fade-in-up" data-original-link="${detailLink}">
        <div class="flex gap-4 sm:gap-5">
            <!-- Logo -->
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center shadow-sm mt-0.5">
                <img src="${logoUrl}" alt="${company}" class="w-full h-full object-cover" onerror="${imgError}">
            </div>
            <!-- Content -->
            <div class="flex-1 min-w-0 flex flex-col">
                <!-- Title + Salary -->
                <div class="flex items-start justify-between gap-3 mb-1.5">
                    <h3 class="text-base sm:text-lg font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary-500 transition-colors duration-200 pr-2">${title}</h3>
                    ${salaryText ? `<span class="inline-flex items-center text-sm font-bold text-primary-500 whitespace-nowrap flex-shrink-0 bg-primary-50/80 px-3 py-1 rounded-lg border border-primary-100">${salaryText}</span>` : ''}
                </div>
                <!-- Company -->
                <p class="text-sm text-gray-500 font-medium mb-2 flex items-center gap-1.5">
                    <i class="fas fa-building text-gray-300 text-[10px]"></i>
                    ${company}
                </p>
                <!-- Meta -->
                ${metaHtml}
                <!-- Tags -->
                <div class="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                    ${sourceHtml}
                    ${premiumHtml}
                </div>
            </div>
        </div>
    </div>`;
}

/**
 * Empty state card
 */
export function noDataCard() {
    return `<div class="col-span-full flex items-center justify-center py-16 animate-fade-in">
        <div class="text-center">
            <div class="w-16 h-16 mx-auto bg-orange-50 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF8C00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-1">Heç bir vakansiya tapılmadı</h3>
            <p class="text-sm text-gray-500">Xahiş edirik filtrləri dəyişib yenidən yoxlayın</p>
        </div>
    </div>`;
}
