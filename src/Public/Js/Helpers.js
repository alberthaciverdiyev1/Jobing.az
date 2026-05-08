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
 * Modern job card template
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

    if (compact) {
        // Compact version for home page grid
        return `<div class="job-card" data-original-link="${element.redirectUrl}">
            <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    <img src="${logoUrl}" alt="${company}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<span class=\\'text-lg font-bold text-gray-400\\'>${company.charAt(0)}</span>'">
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">${title}</h3>
                    <p class="text-xs text-gray-500 mb-1">
                        <i class="fas fa-building mr-1 text-gray-400"></i>${company}
                    </p>
                    <div class="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                        <span><i class="fas fa-calendar-alt mr-0.5 text-gray-300"></i>${postedDate}</span>
                        <span><i class="fas fa-map-marker-alt mr-0.5 text-gray-300"></i>${location}</span>
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <span class="job-tag ${element.sourceUrl === 'jobing' ? 'jobing' : 'full-time'}">
                    ${element.sourceUrl}
                </span>
                ${salaryText ? `<span class="text-sm font-semibold text-gray-900">${salaryText}</span>` : ''}
            </div>
        </div>`;
    }

    // Full version for jobs listing page
    return `<div class="job-card" data-original-link="${element.redirectUrl}">
        <div class="flex items-start gap-4">
            <div class="w-14 h-14 rounded-xl bg-gray-50 border border-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                <img src="${logoUrl}" alt="${company}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<span class=\\'text-xl font-bold text-gray-300\\'>${company.charAt(0)}</span>'">
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                    <h3 class="font-semibold text-gray-900 text-base leading-snug mb-1">${title}</h3>
                    ${salaryText ? `<span class="text-sm font-semibold text-primary-500 whitespace-nowrap flex-shrink-0">${salaryText}</span>` : ''}
                </div>
                <p class="text-sm text-gray-500 mb-2">
                    <i class="fas fa-building mr-1 text-gray-400"></i>${company}
                </p>
                <div class="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <span><i class="fas fa-calendar-alt mr-0.5"></i>${postedDate}</span>
                    <span><i class="fas fa-map-marker-alt mr-0.5"></i>${location}</span>
                </div>
                <div class="flex flex-wrap items-center gap-2 mt-3">
                    <span class="job-tag ${element.sourceUrl === 'jobing' ? 'jobing' : 'full-time'}">
                        ${element.sourceUrl}
                    </span>
                    ${element.isPremium ? '<span class="job-tag" style="background:#fef3c7;color:#92400e;">premium</span>' : ''}
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
