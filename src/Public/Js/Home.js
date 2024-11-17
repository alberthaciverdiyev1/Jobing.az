document.addEventListener("DOMContentLoaded", (event) => {

    async function getJobs(params) {
        await axios.get('/api/jobs', {
            params: params
        }).then(res => {
            let htmlContent = '';

            if (res.status === 200) {
                // alert(res.data.jobs.length);
                if (res.data.totalCount) {
                    let data = res.data.jobs.slice(0, 12);
                    data.forEach(element => {
                        htmlContent += `<div class="job-card home-margin-bottom bg-white px-3 pt-2 h-40 rounded-xl shadow-md mb-4 hover:hover-card-color cursor-pointer duration-300 border border-custom sm:px-5" data-original-link="${element.redirectUrl}">
                                        <div class="content flex">
                                            <div class="mt-3 sm:mt-1 ">
                                                <span class="mr-2">
                                                    <img src="../Images/${element.sourceUrl}.png" 
                                                        alt="Company Logo" class="w-12 h-12 rounded-lg border border-custom sm:w-14 sm:h-14" />
                                                </span>
                                                <span class="mr-2">
                                                    <img src="${element.companyImageUrl ?? "../Images/DefaultCompany.png"}"
                                                        alt="Company Logo" class="w-12 h-12 rounded-lg sm:w-14 sm:h-14 border border-custom" />
                                                </span>
                                            </div>
                                            <div class="ml-3 mt-2 pr-1 sm:mt-2 sm:w-auto">
                                                <div class="flex mb-1 justify-between">
                                                    <div class="">
                                                        <p class="text-sm font-bold flex text-gray-700 justify-items-start sm:font-bold sm:text-base">
                                                            <span class="truncate sm:hidden">
                                                                ${element.title.length > 17 ? element.title.slice(0, 17) + '...' : element.title}
                                                            </span>
                                                            <span class="sm:block hidden">
                                                                ${element.title}
                                                            </span>
                                                            <span class="bg-yellow-100 text-yellow-700 px-1 ml-2 py-0.5 font-medium rounded-lg text-sm h-7 hidden sm:flex">
                                                                ${element.sourceUrl}
                                                            </span>
                                                        </p>
                                                            <h4 class="text-base font-semibold text-gray-700 mb-2 sm:font-bold sm:block">
                                                                <i class="fa-solid fa-building"></i> ${element.companyName}
                                                            </h4>
                                                            <h4 class="text-base font-semibold text-gray-700 mb-2 sm:font-bold sm:hidden">
                                                                <i class="fa-solid fa-building"></i> ${element.companyName.length > 17 ? element.companyName.slice(0, 17) + '...' : element.companyName}
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
                                                    <span class="ml-3"><i class="fa-solid fa-location-dot mr-0.5"></i> ${element.location}</span>
                                                </div>
                                                <div class="border-t border-1 border-gray-300 w-56 mt-2 sm:w-72"></div>
                                                <div class="text-sm mt-2 hidden sm:flex">
                                                    <span class="bg-blue-100 text-blue-700 px-1 ml-1 py-0.5 rounded-lg">Html</span>
                                                    <span class="bg-blue-100 text-blue-700 px-1 ml-1 py-0.5 rounded-lg">Css</span>
                                                    <span class="bg-blue-100 text-blue-700 px-1 ml-1 py-0.5 rounded-lg">C#</span>
                                                    <span class="bg-blue-100 text-blue-700 px-1 ml-1 py-0.5 rounded-lg">Php</span>
                                                    <span class="bg-blue-100 text-blue-700 px-1 ml-1 py-0.5 rounded-lg">Mysql</span>
                                                </div>
                                                <div class="text-sm mt-2 flex justify-between sm:hidden">
                                                   <span class="bg-blue-100 text-blue-700 px-1 py-0.5 rounded-lg text-sm">${element.sourceUrl}</span>
                                                    <h4 class="text-lg text-gray-600 font-bold">${(+element.minSalary !== "null" ? +element.minSalary + '-' : "") + +element.maxSalary ?? (!element.minSalary && !element.maxSalary ? "Razilasma ile" : "")}</h4>
                                                </div>
                                            </div>
                                            <div class="flex flex-col justify-between h-full flex-grow hidden sm:flex">
                                                <div class="text-right">
                                                ${false ? ` <button class="text-base text-gray-600 font-bold mb-2 w-8 h-8">
                                                        <i class="fa-solid fa-heart text-2xl"></i>
                                                    </button>` : ""}
                                                    <h4 class="text-lg text-gray-600 font-bold mt-2">${(+element.minSalary ? element.minSalary + '-' : "") + +element.maxSalary ?? (!element.minSalary && !element.maxSalary ? "Razilasma ile" : "")}</h4>
                                                </div>
                                                <div class="flex justify-end items-end mt-auto pt-16">
                                                    <a href="${element.redirectUrl}" target="_blank" class="filled-button-color text-white py-2 px-8 rounded-full">
                                                        Visit 
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div> `;
                    });

                }

                document.getElementById("home-card-section").innerHTML = htmlContent;

                const jobCards = document.querySelectorAll('.job-card');
                jobCards.forEach(card => {
                    card.addEventListener('click', function () {
                        const originalLink = this.getAttribute('data-original-link');
                        window.open(originalLink, '_blank');
                    });
                });
            }
        }).catch(error => {
            console.error("Error fetching jobs:", error);
        });
    }
    getJobs();

    async function getCategories() {
        let o = `<option value="">All Categories</option>`;
        await axios.get('/api/categories', {
            params: { site: "bossAz" }
        })
            .then(res => {
                if (res.status === 200) {
                    res.data.forEach(element => {
                        o += `                        
                        <option value="${element.localCategoryId}">${element.name}</option>`
                    })
                    document.getElementById("category-select").innerHTML = o;
                }
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });

    }
    getCategories();

    async function getCities() {
        let o = `<option value="">All Cities</option>`;

        await axios.get('/api/cities', {
            params: { site: "BossAz" }
        })
            .then(res => {
                if (res.status === 200) {
                    res.data.forEach(element => {
                        o += `                        
                        <option value="${element.cityId}">${element.name}</option>`
                    })
                    document.getElementById("city-select").innerHTML = o;
                }
            })
            .catch(error => {
                console.error("Error fetching cities:", error);
            });

    }
    getCities();

    document.getElementById("filter-jobs").addEventListener("click", () => {
        const categorySelect = document.getElementById('category-select');
        const citySelect = document.getElementById('city-select');
        const keywordInput = document.getElementById('keyword');

        const categoryId = categorySelect?.value ? +categorySelect.value : '';
        const cityId = citySelect?.value ? +citySelect.value : '';
        const keyword = keywordInput?.value || '';

        // console.log({categoryId,cityId,keyword});return;
        
        window.location.href = `http://localhost:3000/jobs?minSalary=0&maxSalary=5000&offset=0${categoryId ? `&categoryId=${categoryId}`:''}${cityId ? `&cityId=${cityId}` : ''}${keyword.length > 0 ? `&keyword=${keyword}` : ''}`;
    });
});
