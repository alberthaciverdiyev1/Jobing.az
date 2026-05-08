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
 * Premium job card — redesigned from scratch
 */
export function createJobCard(element, compact = false) {
    const logoUrl = (element.companyImageUrl && element.companyImageUrl !== "/nologo.png" && !element.companyImageUrl.startsWith('http'))
        ? element.companyImageUrl.replace(/src\/Public/g, '..')
        : (element.companyImageUrl && element.companyImageUrl.startsWith('http')
            ? element.companyImageUrl
            : "../Images/DefaultCompany.png");

    const salaryText = ((+element.minSalary === +element.maxSalary && +element.minSalary !== null && +element.minSalary !== 0)
        ? +element.minSalary + " " + element.currencySign
        : ((+element.minSalary !== null && +element.minSalary !== 0)
            ? +element.minSalary + ' - '
            : "") + ((+element.maxSalary !== null && +element.maxSalary !== 0)
            ? +element.maxSalary + " " + element.currencySign
            : (!element.minSalary && !element.maxSalary ? "" : ""))
    );

    const postedDate = element.postedAt ? element.postedAt.slice(0, 10) : '';
    const title = capitalizeFirstLetter(element.title);
    const company = capitalizeFirstLetter(element.companyName);
    const location = element.location;
    const logoFallback = company.charAt(0);
    const defaultImg = "../Images/DefaultCompany.png";
    const imgError = `this.onerror=null;this.src='${defaultImg}'`;

    if (compact) {
        // Compact version — for home page grid
        return `<div class="job-card group bg-white rounded-xl border border-gray-100 p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/5 hover:border-orange-200 animate-fade-in-up" data-original-link="${element.redirectUrl}">
            <div class="flex items-start gap-3.5">
                <div class="w-11 h-11 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center shadow-sm">
                    <img src="${logoUrl}" alt="${company}" class="w-full h-full object-cover" onerror="${imgError}">
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2">
                        <h3 class="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-primary-500 transition-colors duration-200">${title}</h3>
                        ${salaryText ? `<span class="text-xs font-bold text-primary-500 whitespace-nowrap flex-shrink-0">${salaryText}</span>` : ''}
                    </div>
                    <p class="text-xs text-gray-400 mt-0.5 mb-1.5">${company}</p>
                    <div class="flex flex-wrap items-center gap-2.5 text-[11px] text-gray-400">
                        <span><i class="far fa-calendar mr-0.5 text-gray-300"></i>${postedDate}</span>
                        <span><i class="fas fa-map-marker-alt mr-0.5 text-gray-300"></i>${location}</span>
                    </div>
                    <div class="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-gray-50">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${element.sourceUrl === 'jobing' ? 'bg-orange-50 text-orange-700 border border-orange-200/50' : 'bg-blue-50 text-blue-700 border border-blue-200/50'}">
                            ${element.sourceUrl}
                        </span>
                    </div>
                </div>
            </div>
        </div>`;
    }

    // Full version — for jobs listing page
    return `<div class="job-card group bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-200/50 animate-fade-in-up" data-original-link="${element.redirectUrl}">
        <div class="flex gap-4">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center shadow-sm mt-0.5">
                <img src="${logoUrl}" alt="${company}" class="w-full h-full object-cover" onerror="${imgError}">
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-3 mb-1">
                    <h3 class="font-semibold text-gray-900 text-[15px] leading-snug line-clamp-2 group-hover:text-primary-500 transition-colors duration-200">${title}</h3>
                    ${salaryText ? `<span class="inline-flex items-center text-sm font-bold text-primary-500 whitespace-nowrap flex-shrink-0 bg-primary-50/60 px-2.5 py-1 rounded-lg">${salaryText}</span>` : ''}
                </div>
                <p class="text-sm text-gray-400 flex items-center gap-1.5 mb-2">
                    <i class="fas fa-building text-gray-300 text-[10px]"></i>
                    ${company}
                </p>
                <div class="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3">
                    <span class="inline-flex items-center gap-1.5">
                        <i class="far fa-calendar text-gray-300"></i>${postedDate}
                    </span>
                    <span class="text-gray-200">|</span>
                    <span class="inline-flex items-center gap-1.5">
                        <i class="fas fa-map-marker-alt text-gray-300"></i>${location}
                    </span>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium ${element.sourceUrl === 'jobing' ? 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border border-orange-200/50' : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200/50'}">
                        ${element.sourceUrl}
                    </span>
                    ${element.isPremium ? '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-200/50"><i class="fas fa-crown text-[9px]"></i> premium</span>' : ''}
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
