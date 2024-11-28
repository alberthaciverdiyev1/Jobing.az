// import axios from 'axios';
document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([getCategories(), getCities(), getEducation(), getExperience()]);
    preselectFilters();
});

var thumbsize = 14;
let categoryArray = [], cityArray = [];
let showMoreCategories = true;
let showMoreCities = true;
let offset = 0;
let categoryId = null,
    cityId = null,
    educationId = null,
    jobType = null,
    minSalary = null,
    maxSalary = null,
    experienceLevel = null;
const removePrefix = (value, prefix) => {
    if (value?.startsWith(prefix)) {
        return value.slice(prefix.length);
    }
    return value;
};


function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    const categoryId = removePrefix(params.get('categoryId'), 'category-');
    const cityId = removePrefix(params.get('cityId'), 'city-');
    const educationId = removePrefix(params.get('educationId'), "education-");
    const experienceLevel = removePrefix(params.get('experienceLevel'), "experience-");
    const keyword = params.get('keyword');
    const offset = params.get('offset') || 0;

    return {
        categoryId,
        cityId,
        educationId,
        experienceLevel,
        keyword,
        offset
    };
}

function updateURLParams(params) {
    const currentParams = new URLSearchParams(window.location.search);

    for (const key in params) {
        if (params[key] !== undefined && params[key]) {
            currentParams.set(key, params[key]);
        } else {
            currentParams.delete(key);
        }
    }
    window.history.replaceState({}, '', '?' + currentParams.toString());
}

function preselectFilters() {
    const { categoryId, cityId, educationId, experienceLevel, keyword } = getURLParams();

    if (categoryId && !isNaN(Number(categoryId))) {
        if (categoryId > 10) document.getElementById("categoryList").innerHTML = categoryHTML(categoryArray);
        addRadioChangeListener("category");

        document.querySelector(`input[name="category"][id="category-${+categoryId}"]`).checked = true;
    } else {
        document.querySelector(`input[name="category"][id="all"]`).checked = true;
    }

    if (cityId && !isNaN(Number(cityId))) {
        if (cityId !== 28 || cityId !== 12 || cityId !== 83 || cityId !== 87 || cityId !== 85 || cityId !== 34 || cityId !== 88) document.getElementById("cityList").innerHTML = cityHTML(cityArray);
        addRadioChangeListener("city");

        document.querySelector(`input[name="city"][id="city-${cityId}"]`).checked = true;
    } else {
        document.querySelector(`input[name="city"][id="city-all"]`).checked = true;
    }

    if (educationId && !isNaN(Number(educationId))) {
        document.querySelector(`input[name="education"][id="education-${+educationId}"]`).checked = true;
    }

    if (experienceLevel && !isNaN(Number(experienceLevel))) {
        document.querySelector(`input[name="experience"][id="experience-${+experienceLevel}"]`).checked = true;
    }

    if (keyword) {
        document.querySelector(`#search`).value = keyword;
    }
    getJobs(
        {
            categoryId: !isNaN(Number(categoryId)) ? categoryId : null,
            cityId: !isNaN(Number(cityId)) ? cityId : null,
            educationId: !isNaN(Number(educationId)) ? educationId : null,
            experienceLevel,
            offset,
            keyword
        });

}

function categoryHTML(data, limit = null) {
    let htmlContent = "";
    if (limit) {
        data = data.slice(0, limit);
    }
    data.forEach(element => {
        const categoryId = `category-${element.localCategoryId}`;
        htmlContent += `
        <div class="flex items-center"> 
            <input type="radio" name="category" id="${categoryId}" category-id="${element.localCategoryId}" class="custom-checkbox" />
            <label for="${categoryId}" class="text-gray-800">
                ${element.name}
                <span class="text-gray-400">(34)</span>
            </label>
        </div>`;
    });
    return htmlContent;
}

function noDataCard() {
    return `<div class="flex items-center justify-center min-h-screen bg-white  border border-custom rounded-lg">
                <div class="flex flex-col items-center justify-center w-full max-w-xs mx-auto">
                  <div class="w-20 h-20 mx-auto bg-orange-500 rounded-full shadow-sm flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="33" height="32" viewBox="0 0 33 32" fill="none">
                      <g id="File Search">
                        <path id="Vector" d="M19.9762 4V8C19.9762 8.61954 19.9762 8.92931 20.0274 9.18691C20.2379 10.2447 21.0648 11.0717 22.1226 11.2821C22.3802 11.3333 22.69 11.3333 23.3095 11.3333H27.3095M18.6429 19.3333L20.6429 21.3333M19.3095 28H13.9762C10.205 28 8.31934 28 7.14777 26.8284C5.9762 25.6569 5.9762 23.7712 5.9762 20V12C5.9762 8.22876 5.9762 6.34315 7.14777 5.17157C8.31934 4 10.205 4 13.9762 4H19.5812C20.7604 4 21.35 4 21.8711 4.23403C22.3922 4.46805 22.7839 4.90872 23.5674 5.79006L25.9624 8.48446C26.6284 9.23371 26.9614 9.60833 27.1355 10.0662C27.3095 10.524 27.3095 11.0253 27.3095 12.0277V20C27.3095 23.7712 27.3095 25.6569 26.138 26.8284C24.9664 28 23.0808 28 19.3095 28ZM19.3095 16.6667C19.3095 18.5076 17.8171 20 15.9762 20C14.1352 20 12.6429 18.5076 12.6429 16.6667C12.6429 14.8257 14.1352 13.3333 15.9762 13.3333C17.8171 13.3333 19.3095 14.8257 19.3095 16.6667Z" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                      </g>
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-center text-black text-xl font-semibold leading-loose pb-2">Heç bir vakansiya tapılmadı</h2>
                    <p class="text-center text-black text-base font-normal leading-relaxed pb-4">Xahiş edirik filterləri dəyişib <br />yenidən yoxlayın</p>
                  </div>
                </div>
              </div>`
}

function loader(start = false) {
    document.getElementById("card-section").innerHTML = start
        ? `<div class="flex items-center justify-center min-h-screen bg-white  border border-custom rounded-lg">
                   <div class="flex flex-col items-center justify-center w-full max-w-xs mx-auto">
                           <span class="loader"></span>
                   </div>
              </div>`
        : "";
}

function cityHTML(data, limit = null) {
    let htmlContent = "";
    if (limit) {
        data = data.slice(0, limit);
    }
    data.forEach(element => {
        const cityId = `city-${element.cityId}`;

        htmlContent += `
        <div class="flex items-center"> 
            <input type="radio" name="city" id="${cityId}" city-id="${element.cityId}" class="custom-checkbox" />
            <label for="${cityId}" class="text-gray-800">
                ${element.name}
                <span class="text-gray-400">(34)</span>
            </label>
        </div>
            `;
    });
    return htmlContent;
}


async function getCategories() {
    await axios.get('/api/categories', {
        params: { website: "BossAz" }
    })
        .then(res => {
            if (res.status === 200) {
                categoryArray = res.data;
                document.getElementById("categoryList").innerHTML = categoryHTML(res.data, 10);
                addRadioChangeListener("category");
            }
        })
        .catch(error => {
            console.error("Error fetching categories:", error);
        });

}
// getCategories();


async function getCities() {
    await axios.get('/api/cities', {
        params: { site: "BossAz" }
    })
        .then(res => {
            if (res.status === 200) {
                cityArray = res.data;
                document.getElementById("cityList").innerHTML = cityHTML(res.data, 7);
                addRadioChangeListener("city");

            }
        })
        .catch(error => {
            console.error("Error fetching categories:", error);
        });

}
// getCities();

async function getEducation() {
    await axios.get('/education')
        .then(res => {
            let htmlContent = '';
            if (res.status === 200) {
                Object.entries(res.data).forEach((education) => {
                    const educationId = `education-${education[1]}`;
                    htmlContent += `
                        <div class="flex items-center"> 
                            <input type="radio" name="education" id="${educationId}" education-id="${education[1]}" class="custom-checkbox" />
                            <label for="${educationId}" class="text-gray-800">
                            ${education[0]}
                                <span class="text-gray-400">(34)</span>
                            </label>
                        </div>`;
                });
            }
            document.getElementById("educationList").innerHTML = htmlContent;
            addRadioChangeListener("education");

        })
        .catch(error => {
            console.error("Error fetching categories:", error);
        });

}
// getEducation();

async function getExperience() {
    await axios.get('/experience')
        .then(res => {
            let htmlContent = '';
            if (res.status === 200) {
                Object.entries(res.data).forEach((experience) => {
                    const experienceId = `experience-${experience[1]}`;
                    htmlContent += `
                        <div class="flex items-center"> 
                            <input type="radio" name="experience" id="${experienceId}" experience-id="${experience[1]}" class="custom-checkbox" />
                            <label for="${experienceId}" class="text-gray-800">
                            ${experience[0]}
                                <span class="text-gray-400">(34)</span>
                            </label>
                        </div>`;
                });
            }
            document.getElementById("experienceList").innerHTML = htmlContent;
            addRadioChangeListener("experience");

        })
        .catch(error => {
            console.error("Error fetching experiences:", error);
        });

}
// getExperience();

const scrollThreshold = 100;

window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - scrollThreshold) {
        if (!loading) {
            loading = true;
            offset += 10;
            handleFilterChange();

        }
    }
});

let loading = false;

async function getJobs(params) {
    !offset ? loader(true) : "";
    let jobList = [];

    try {
        const res = await axios.get('/api/jobs', {
            params: params
        });

        let htmlContent = '';
        let headerContent = '';

        if (res.status === 200) {
            if (res.data.totalCount) {
                jobList = res.data.jobs;
                res.data.jobs.forEach(element => {
                    htmlContent += `<div class="job-card bg-white px-3 pt-2 h-40 rounded-xl shadow-md mb-4 hover:hover-card-color cursor-pointer duration-300 border border-custom sm:px-5" data-original-link="${element.redirectUrl}">
                                        <div class="content flex">
                                             <div class="mt-3 flex-shrink-0 sm:mt-1">
                                                <img src="../Images/${element.sourceUrl}.png" alt="Company Logo" class="border-custom h-12 w-12 mt-1 rounded-lg border sm:h-14 sm:w-14" />
                                                <img src="${(element.companyImageUrl && element.companyImageUrl !== "/nologo.png") ? element.companyImageUrl : "../Images/DefaultCompany.png"}" alt="Company Logo" class="border-custom h-12 w-12 mt-3 rounded-lg border sm:h-14 sm:w-14" />
                                            </div>
                                            <div class="ml-3 mt-2 pr-1 sm:mt-2 sm:w-auto">
                                                <div class="flex mb-1 justify-between">
                                                    <div class="">
                                                        <p class="text-sm font-bold flex text-gray-700 justify-items-start sm:font-bold sm:text-base mb-1">
                                                            <span class="truncate sm:hidden"> 
                                                                ${element.title.slice(0, 17) + (element.title.length > 17 ? "..." : "")} 
                                                            </span>
                                                            <span class="hidden sm:inline sm:whitespace-normal"> 
                                                                ${element.title.slice(0, 35) + (element.title.length > 35 ? "..." : "")} 
                                                            </span>
                                                        </p>
                                                        <h4 class="truncate sm:hidden text-sm font-semibold text-gray-700 mb-1 sm:font-bold"> 
                                                            <i class="fa-solid fa-building"></i> ${element.companyName.slice(0, 17) + (element.companyName.length > 17 ? "..." : "")}
                                                        </h4>
                                                        <h4 class="hidden sm:inline sm:whitespace-normal text-sm font-semibold text-gray-700 mb-1 sm:font-bold"> 
                                                            <i class="fa-solid fa-building"></i> ${element.companyName.slice(0, 40) + (element.companyName.length > 40 ? "..." : "")}
                                                        </h4>
                                                    </div>
                                                    <div class="hidden sm:w-full">
                                                    ${true ? "" : ` <span class="bg-blue-100 text-blue-700 px-1 ml-3 py-0.5 h-12 w-auto rounded-lg text-sm">
                                                            ${element.jobType}
                                                        </span>`}
                                                        <span class="bg-yellow-100 text-yellow-700 px-1 ml-2 py-0.5 rounded-lg text-sm w-auto">
                                                            ${element.sourceUrl}
                                                        </span>
                                                    </div>
                                                    ${false ? `<button class="text-base text-gray-600 font-bold mb-5 sm:hidden">
                                                        <i class="fa-solid fa-heart text-2xl"></i>
                                                    </button>` : ""}
                                                        
                                                </div>
                                                <div class="flex text-sm text-gray-600">
                                                    <span><i class="fa-solid fa-clock mr-0.5"></i> ${element.postedAt.slice(0, 10)}</span>
                                                    <span class="ml-3"><i class="fa-solid fa-location-dot mr-0.5"></i> ${element.location.slice(0, 17) + (element.location.length > 17 ? "..." : "")}</span>
                                                </div>
                                                <div class="border-t border-1 border-gray-300 w-56 mt-2 sm:w-72"></div>
                                                    <div class="text-sm mt-2 hidden sm:flex">
                                                        <span class="bg-yellow-100 text-yellow-700 px-1 ml-2 py-0.5 font-medium rounded-lg text-sm h-7 hidden sm:flex">
                                                            ${element.sourceUrl}
                                                        </span>
                                                        <span class="bg-green-500 text-white px-1 ml-1 py-0.5 rounded-lg">aktivdir</span>
                                                    </div>
                                                <div class="text-sm mt-2 flex justify-between sm:hidden">
                                                   <span class="bg-blue-100 text-blue-700 px-1 py-0.5 rounded-lg text-sm">${element.sourceUrl}</span>
                                                <h4 class="text-lg text-gray-600 font-bold">
                                                    ${(
                                                        (+element.minSalary === +element.maxSalary && +element.minSalary !== null && +element.minSalary !== 0)
                                                            ? +element.minSalary + " " + element.currencySign
                                                            : (
                                                                (+element.minSalary !== null && +element.minSalary !== 0)
                                                                    ? +element.minSalary + '-'
                                                                    : ""
                                                            ) + (
                                                                (+element.maxSalary !== null && +element.maxSalary !== 0)
                                                                    ? +element.maxSalary + " " + element.currencySign
                                                                    : (
                                                                        !element.minSalary && !element.maxSalary ? "Razılaşma ilə" : ""
                                                                    )
                                                            )
                                                    )}
                                                    </h4>
                                                </div>
                                            </div>
                                            <div class="flex flex-col justify-between h-full flex-grow hidden sm:flex">
                                                <div class="text-right">
                                                ${false ? ` <button class="text-base text-gray-600 font-bold mb-2 w-8 h-8">
                                                        <i class="fa-solid fa-heart text-2xl"></i>
                                                    </button>` : ""}
                                                <h4 class="text-lg text-gray-600 font-bold mt-2">
                                                    ${(
                                                            (+element.minSalary === +element.maxSalary && +element.minSalary !== null && +element.minSalary !== 0)
                                                                ? +element.minSalary + " " + element.currencySign
                                                                : (
                                                                    (+element.minSalary !== null && +element.minSalary !== 0)
                                                                        ? +element.minSalary + '-'
                                                                        : ""
                                                                ) + (
                                                                    (+element.maxSalary !== null && +element.maxSalary !== 0)
                                                                        ? +element.maxSalary + " " + element.currencySign
                                                                        : (
                                                                            !element.minSalary && !element.maxSalary ? "Razılaşma ilə" : ""
                                                                        )
                                                                    )
                                                            )}                                              
                                                </h4>
                                                </div>
                                                <div class="flex justify-end items-end mt-auto pt-16">
                                                    <a href="${element.redirectUrl}" target="_blank" class="filled-button-color text-white py-2 px-8 rounded-full">
                                                        Keçid Et 
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div> `;
                });

                if (offset && jobList.length > 0) {
                    document.getElementById("card-section").insertAdjacentHTML('beforeend', htmlContent);
                } else if (jobList.length > 0) {
                    document.getElementById("card-section").innerHTML = headerContent + htmlContent;
                }
            } else {
                document.getElementById("card-section").innerHTML = noDataCard();
            }
            
            const jobCards = document.querySelectorAll('.job-card');
            jobCards.forEach(card => {
                card.addEventListener('click', function () {
                    const originalLink = this.getAttribute('data-original-link');
                    window.open(originalLink, '_blank');
                });
            });
        }
    } catch (err) {
        console.error(err);
    }
}





// async function getJobs(params) {
//     !offset ? loader(true) : "";
//     let jobList = [];

//     await axios.get('/api/jobs', {
//         params: params
//     }).then(res => {
//         let htmlContent = '';
//         let headerContent = '';
//         let loadMoreButton = '';
//         if (false) {
//             headerContent = `<div class="flex justify-between mb-3 bg-white py-1 px-4 rounded-lg text-center items-center sm:py-2">
//                                         <span class="text-sm">500 results</span>
//                                         <select name="" id="" class="w-16 rounded-lg h-6 border-custom sm:8 sm:w-32 sm:h-8">
//                                             <option value="">aa</option>
//                                             <option value="">aa</option>
//                                             <option value="">aa</option>
//                                             <option value="">aa</option>
//                                         </select>
//                                     </div>`;
//         }

//         if (res.status === 200) {
//             if (res.data.totalCount) {
//                 jobList = res.data.jobs;
//                 res.data.jobs.forEach(element => {
//                     htmlContent += `<div class="job-card bg-white px-3 pt-2 h-40 rounded-xl shadow-md mb-4 hover:hover-card-color cursor-pointer duration-300 border border-custom sm:px-5" data-original-link="${element.redirectUrl}">
//                                             <div class="content flex">
//                                                  <div class="mt-3 flex-shrink-0 sm:mt-1">
//                                                     <img src="../Images/${element.sourceUrl}.png" alt="Company Logo" class="border-custom h-12 w-12 mt-1 rounded-lg border sm:h-14 sm:w-14" />
//                                                     <img src="${(element.companyImageUrl && element.companyImageUrl !== "/nologo.png") ? element.companyImageUrl : "../Images/DefaultCompany.png"}" alt="Company Logo" class="border-custom h-12 w-12 mt-3 rounded-lg border sm:h-14 sm:w-14" />
//                                                 </div>
//                                                 <div class="ml-3 mt-2 pr-1 sm:mt-2 sm:w-auto">
//                                                     <div class="flex mb-1 justify-between">
//                                                         <div class="">
//                                                             <p class="text-sm font-bold flex text-gray-700 justify-items-start sm:font-bold sm:text-base mb-1">
//                                                                 <span class="truncate sm:hidden"> 
//                                                                     ${element.title.slice(0, 17) + (element.title.length > 17 ? "..." : "")} 
//                                                                 </span>
//                                                                 <span class="hidden sm:inline sm:whitespace-normal"> 
//                                                                     ${element.title.slice(0, 40) + (element.title.length > 40 ? "..." : "")} 
//                                                                 </span>
//                                                             </p>
//                                                             <h4 class="truncate sm:hidden text-sm font-semibold text-gray-700 mb-1 sm:font-bold"> 
//                                                                 <i class="fa-solid fa-building"></i> ${element.companyName.slice(0, 17) + (element.companyName.length > 17 ? "..." : "")}
//                                                             </h4>
//                                                             <h4 class="hidden sm:inline sm:whitespace-normal text-sm font-semibold text-gray-700 mb-1 sm:font-bold"> 
//                                                                 <i class="fa-solid fa-building"></i> ${element.companyName.slice(0, 50) + (element.companyName.length > 50 ? "..." : "")}
//                                                             </h4>
//                                                         </div>
//                                                         <div class="hidden sm:w-full">
//                                                         ${true ? "" : ` <span class="bg-blue-100 text-blue-700 px-1 ml-3 py-0.5 h-12 w-auto rounded-lg text-sm">
//                                                                 ${element.jobType}
//                                                             </span>`}
//                                                             <span class="bg-yellow-100 text-yellow-700 px-1 ml-2 py-0.5 rounded-lg text-sm w-auto">
//                                                                 ${element.sourceUrl}
//                                                             </span>
//                                                         </div>
//                                                         ${false ? `<button class="text-base text-gray-600 font-bold mb-5 sm:hidden">
//                                                             <i class="fa-solid fa-heart text-2xl"></i>
//                                                         </button>` : ""}
                                                        
//                                                     </div>
//                                                     <div class="flex text-sm text-gray-600">
//                                                         <span><i class="fa-solid fa-clock mr-0.5"></i> ${element.postedAt.slice(0, 10)}</span>
//                                                         <span class="ml-3"><i class="fa-solid fa-location-dot mr-0.5"></i> ${element.location.slice(0, 17) + (element.location.length > 17 ? "..." : "")}</span>
//                                                     </div>
//                                                     <div class="border-t border-1 border-gray-300 w-56 mt-2 sm:w-72"></div>
//                                                         <div class="text-sm mt-2 hidden sm:flex">
//                                                             <span class="bg-yellow-100 text-yellow-700 px-1 ml-2 py-0.5 font-medium rounded-lg text-sm h-7 hidden sm:flex">
//                                                                 ${element.sourceUrl}
//                                                             </span>
//                                                             <span class="bg-green-100 text-green-700 px-1 ml-1 py-0.5 rounded-lg">aktivdir</span>
//                                                         </div>
//                                                     <div class="text-sm mt-2 flex justify-between sm:hidden">
//                                                        <span class="bg-blue-100 text-blue-700 px-1 py-0.5 rounded-lg text-sm">${element.sourceUrl}</span>
//                                                     <h4 class="text-lg text-gray-600 font-bold">
//                                                         ${(
//                                                             (+element.minSalary === +element.maxSalary && +element.minSalary !== null && +element.minSalary !== 0)
//                                                                 ? +element.minSalary + " " + element.currencySign
//                                                                 : (
//                                                                     (+element.minSalary !== null && +element.minSalary !== 0)
//                                                                         ? +element.minSalary + '-'
//                                                                         : ""
//                                                                 ) + (
//                                                                     (+element.maxSalary !== null && +element.maxSalary !== 0)
//                                                                         ? +element.maxSalary + " " + element.currencySign
//                                                                         : (
//                                                                             !element.minSalary && !element.maxSalary ? "Razılaşma ilə" : ""
//                                                                         )
//                                                                 )
//                                                         )}
//                                                         </h4>
//                                                     </div>
//                                                 </div>
//                                                 <div class="flex flex-col justify-between h-full flex-grow hidden sm:flex">
//                                                     <div class="text-right">
//                                                     ${false ? ` <button class="text-base text-gray-600 font-bold mb-2 w-8 h-8">
//                                                             <i class="fa-solid fa-heart text-2xl"></i>
//                                                         </button>` : ""}
//                                                     <h4 class="text-lg text-gray-600 font-bold mt-2">
//                                                         ${(
//                                                                 (+element.minSalary === +element.maxSalary && +element.minSalary !== null && +element.minSalary !== 0)
//                                                                     ? +element.minSalary + " " + element.currencySign
//                                                                     : (
//                                                                         (+element.minSalary !== null && +element.minSalary !== 0)
//                                                                             ? +element.minSalary + '-'
//                                                                             : ""
//                                                                     ) + (
//                                                                         (+element.maxSalary !== null && +element.maxSalary !== 0)
//                                                                             ? +element.maxSalary + " " + element.currencySign
//                                                                             : (
//                                                                                 !element.minSalary && !element.maxSalary ? "Razılaşma ilə" : ""
//                                                                             )
//                                                                     )
//                                                             )}                                              
//                                                     </h4>
//                                                     </div>
//                                                     <div class="flex justify-end items-end mt-auto pt-16">
//                                                         <a href="${element.redirectUrl}" target="_blank" class="filled-button-color text-white py-2 px-8 rounded-full">
//                                                             Keçid Et 
//                                                         </a>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div> `;
//                 });

//                 loadMoreButton = res.data.totalCount > 50 && !res.data.hideLoadMore ? `<div class="flex justify-center items-center my-2">
//                                         <button class="filled-button-color text-white py-2 px-8 rounded-full" id="loadMore">
//                                             Daha Çox 
//                                         </button>
//                                      </div>` : "";
//             } else {
//                 document.getElementById("card-section").innerHTML = noDataCard();
//             }

//             if (offset && jobList.length > 0) {

//                 document.getElementById("card-section").insertAdjacentHTML('beforeend', htmlContent + loadMoreButton);
//             } else if (jobList.length > 0) {
//                 document.getElementById("card-section").innerHTML = headerContent + htmlContent + loadMoreButton;
//             }

//             const jobCards = document.querySelectorAll('.job-card');
//             jobCards.forEach(card => {
//                 card.addEventListener('click', function () {
//                     const originalLink = this.getAttribute('data-original-link');
//                     window.open(originalLink, '_blank');
//                 });
//             });

//             const loadMoreBtn = document.getElementById('loadMore');
//             if (loadMoreBtn) {
//                 loadMoreBtn.addEventListener('click', function () {
//                     loadMoreBtn.classList.add("hidden");
//                     offset += 50;
//                     handleFilterChange(offset)
//                 });
//             }
//         }
//     }).catch(error => {
//         console.error("Error fetching jobs:", error);
//     });
// }

// getJobs();


document.getElementById("show-more-categories").addEventListener("click", function () {
    if (showMoreCategories) {
        document.getElementById("categoryList").innerHTML = categoryHTML(categoryArray);
        addRadioChangeListener("category");
        this.textContent = "Show Less";
        showMoreCategories = false;
    } else {
        document.getElementById("categoryList").innerHTML = categoryHTML(categoryArray, 10);
        this.textContent = "Show More";
        addRadioChangeListener("category");
        showMoreCategories = true;
    }
});


document.getElementById("show-more-cities").addEventListener("click", function () {
    if (showMoreCities) {
        document.getElementById("cityList").innerHTML = cityHTML(cityArray);
        addRadioChangeListener("city");
        this.textContent = "Show Less";
        showMoreCities = false;
    } else {
        document.getElementById("cityList").innerHTML = cityHTML(cityArray, 10);
        this.textContent = "Show More";
        addRadioChangeListener("city");
        showMoreCities = true;
    }
});

function handleFilterChange(minS = 0, maxS = 5000) {
    if (!minS) {
        let categoryId = removePrefix(document.querySelector('input[name="category"]:checked')?.id, 'category-');
        let cityId = removePrefix(document.querySelector('input[name="city"]:checked')?.id, 'city-');
        let educationId = removePrefix(document.querySelector('input[name="education"]:checked')?.id, 'education-');
        let experienceLevel = removePrefix(document.querySelector('input[name="experience"]:checked')?.id, "experience-");
        let keyword = document.getElementById("search")?.value
        minSalary ?? 0;
        maxSalary ?? 5000;

        updateURLParams({ categoryId, cityId, educationId, experienceLevel, offset, keyword, minSalary, maxSalary });
        getJobs({ categoryId, cityId, educationId, experienceLevel, offset, keyword, minSalary, maxSalary });

    } else {
        maxSalary = maxS ?? 5000;
        minSalary = !isNaN(Number(minS)) ? minS : 0;
        let { categoryId, cityId, educationId, experienceLevel, keyword } = getURLParams();

        updateURLParams({ categoryId, cityId, educationId, experienceLevel, offset, keyword, minSalary, maxSalary });
        getJobs({ categoryId, cityId, educationId, experienceLevel, offset, keyword, minSalary, maxSalary });
    }

}

document.getElementById("search-btn").addEventListener("click", handleFilterChange);

let searchDebounceTimeout;

document.getElementById("search").addEventListener("keyup", () => {
    searchDebounceTimeout = setTimeout(() => {
        clearTimeout(searchDebounceTimeout);
        handleFilterChange();
    }, 500);
});




function addRadioChangeListener(type) {
    document.querySelectorAll(`input[name="${type}"]`).forEach(radio => {
        radio.addEventListener('change', function () {
            handleFilterChange();
        });
    });
}

// document.getElementById("mobile-filter-btn").onclick = function () {
//     document.getElementById("filter-section").classList.toggle("hidden");
//     document.getElementById("card-section").classList.toggle("hidden");
// };

document.getElementById("mobile-filter-btn").onclick = function () {
    const filterSection = document.getElementById("filter-section");
    const cardSection = document.getElementById("card-section");
    const footer = document.getElementById("footer");

    if (filterSection.classList.contains("hidden")) {
        filterSection.classList.remove("hidden");
        cardSection.classList.add("hidden");
        footer.classList.add("hidden");
    } else {
        filterSection.classList.add("hidden");
        cardSection.classList.remove("hidden");
        footer.classList.remove("hidden");
    }
};


var slider = document.getElementById('slider');

noUiSlider.create(slider, {
    start: [0, 5000],
    range: {
        min: 0,
        max: 5000,
    },
    step: 1,
    format: {
        to: function (value) {
            return Math.round(value);
        },
        from: function (value) {
            return Number(value);
        },
    },
});

let debounceTimeout;

slider.noUiSlider.on('update', function (values) {
    minSalary = values[0];
    maxSalary = values[1];

    document.getElementById('min-value').innerText = values[0];
    document.getElementById('max-value').innerText = values[1];

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        if (values[0]) {
            handleFilterChange(values[0], values[1]);
        }
    }, 500);
});


