import { capitalizeFirstLetter } from './Helpers.js';


document.addEventListener("DOMContentLoaded", (event) => {
    function noDataCard() {
        return `<div class="flex items-center justify-center h-72 bg-white border border-custom rounded-lg">
                    <div class="flex flex-col items-center justify-center w-full max-w-xs mx-auto">
                      <div class="w-20 h-20 mx-auto bg-orange-400 rounded-full shadow-sm flex justify-center items-center">
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

    async function getJobs() {
        await axios.get('/api/jobs',{
            params: {
                'all_jobs':true
            }
        }).then(res => {
            let htmlContent = '';

                    console.log(res)
            if (res.status === 200) {
                // alert(res.data.jobs.length);
                if (res.data.totalCount) {
                    let data = res.data.jobs.slice(0, 12);
                    data.forEach(element => {
                        htmlContent += `<div class="job-card bg-white px-3 pt-2 h-36 lg:h-40 rounded-xl shadow-md hover:hover-card-color cursor-pointer duration-300 border border-custom lg:px-5" data-original-link="${element.redirect_url}">
                        <div class="content flex">
                             <div class="mt-2 flex-shrink-0 lg:mt-1">
                                <img src="../Images/${element.source_url}.png" alt="Company Logo" class="border-custom h-12 w-12 mt-1 rounded-lg border lg:h-14 lg:w-14" />
                                <img src="${(element.company_image_url && element.company_image_url !== "/nologo.png" && !element.company_image_url.startsWith('http')) ? element.company_image_url.replace(/src\/Public/g, '..') : (element.company_image_url && element.company_image_url.startsWith('http') ? element.company_image_url : "../Images/DefaultCompany.png")}" alt="Company Logo" class="border-custom h-12 w-12 mt-3 rounded-lg border lg:h-14 lg:w-14" />
                            </div>
                            <div class="ml-3 mt-2 pr-1 lg:mt-2 justify-end w-screen">
                                <div class="flex mb-1 justify-between">
                                    <div class="w-full">
                                        <div class="flex justify-between w-full">
                                                <p class="text-sm font-bold flex text-gray-700 justify-items-start lg:font-bold lg:text-base mb-1">
                                                    <span class="truncate lg:hidden"> 
                                                        ${capitalizeFirstLetter(element.title.slice(0, 17)) + (element.title.length > 17 ? "..." : "")} 
                                                    </span>
                                                    <span class="hidden lg:inline lg:whitespace-normal"> 
                                                        ${capitalizeFirstLetter(element.title.slice(0, 25)) + (element.title.length > 25 ? "..." : "")} 
                                                    </span>
                                                </p>
                                            <h4 class=" text-gray-600 hidden lg:block ${!element.min_salary && !element.max_salary ? "font-semibold text-base" : "font-bold text-lg"}">
                                                ${(
                                (+element.min_salary === +element.max_salary && +element.min_salary !== null && +element.min_salary !== 0)
                                    ? +element.min_salary + " " + element.currency_sign
                                    : (
                                        (+element.min_salary !== null && +element.min_salary !== 0)
                                            ? +element.min_salary + '-'
                                            : ""
                                    ) + (
                                        (+element.max_salary !== null && +element.max_salary !== 0)
                                            ? +element.max_salary + " " + element.currency_sign
                                            : (
                                                !element.min_salary && !element.max_salary ? "Razılaşma ilə" : ""
                                            )
                                    )
                            )}                                                
                                            </h4>
                                        </div>
                                        <h4 class="truncate lg:hidden text-sm font-semibold text-gray-700 mb-1"> 
                                            <i class="fa-solid fa-building"></i> ${capitalizeFirstLetter(element.company_name.slice(0, 17)) + (element.company_name.length > 17 ? "..." : "")}
                                        </h4>
                                        <h4 class="hidden lg:inline lg:whitespace-normal text-sm font-semibold text-gray-700 mb-1"> 
                                            <i class="fa-solid fa-building"></i> ${capitalizeFirstLetter(element.company_name.slice(0, 32)) + (element.company_name.length > 32 ? "..." : "")}
                                        </h4>
                                    </div>
                                    <div class="hidden lg:w-full">
                                        <span class="bg-yellow-100 text-yellow-700 px-1 ml-2 py-0.5 rounded-lg text-sm w-auto">
                                            ${element.source_url}
                                        </span>
                                    </div>                                    
                                </div>
                                <div class="flex text-sm text-gray-600">
                                    <span><i class="fa-solid fa-clock mr-0.5"></i> ${element.posted_at.slice(0, 10)}</span>
                                    <span class="ml-3"><i class="fa-solid fa-location-dot mr-0.5"></i> ${element.location.slice(0, 10) + (element.location.length > 10 ? "..." : "")}</span>
                                </div>
                                <div class="border-custom-top w-52 mt-2 lg:w-72"></div>
                                    <div class="text-sm mt-2 hidden lg:flex items-center justify-between">
                                      <div class="flex">  <span class="bg-yellow-100 text-yellow-700 px-2 py-0.5 font-medium rounded-lg text-sm h-7 hidden lg:flex">
                                            ${element.source_url}
                                        </span>
                                         ${element.is_premium ? `<span class="bg-orange-500 text-white px-2 ml-1 py-0.5 rounded-lg">premium</span>` : ''}
                                        <span class="bg-green-400 text-white px-2 ml-1  py-0.5 rounded-lg">aktivdir</span></div>
                                        <div class="flex justify-end items-end mt-auto">
                                    <p class="filled-button-color text-white py-2 px-8 rounded-full">
                                        Keçid Et  
                                    </p>
                                </div>
                                        </div>
                                <div class="text-sm mt-2 flex justify-between lg:hidden">
                                   <span class="bg-blue-100 text-blue-700 px-1 py-0.5 rounded-lg text-sm">${element.source_url}</span>
                                <h4 class="text-gray-600 ${!element.min_salary && !element.max_salary ? "font-semibold text-base" : "font-bold text-lg"}">
                                   ${(
                                (+element.min_salary === +element.max_salary && +element.min_salary !== null && +element.min_salary !== 0)
                                    ? +element.min_salary + " " + element.currency_sign
                                    : (
                                        (+element.min_salary !== null && +element.min_salary !== 0)
                                            ? +element.min_salary + '-'
                                            : ""
                                    ) + (
                                        (+element.max_salary !== null && +element.max_salary !== 0)
                                            ? +element.max_salary + " " + element.currency_sign
                                            : (
                                                !element.min_salary && !element.max_salary ? "Razılaşma ilə" : ""
                                            )
                                    )
                            )}   
                                 </h4>
                                </div>
                            </div>
                            <div class="flex flex-col justify-between h-full flex-grow hidden lg:flex">


                            </div>
                        </div>
                    </div> `;
                    });

                    document.getElementById("home-card-section").innerHTML = htmlContent;
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
        }).catch(error => {
            console.error("Error fetching jobs:", error);
        });
    }

    getJobs();

    async function getCategories() {
        let o = `<option value="">Bütün Kateqoriyalar</option>`;
        await axios.get('/api/categories', {
            params: { site: "bossAz" }
        })
            .then(res => {
                if (res.status === 200) {
                    Object.values(res.data).forEach(element => {
                        o += `<option value="${element.local_category_id}">${element.category_name}</option> `
                    });
                    document.getElementById("category-select").innerHTML = o;
                }
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });

    }


    getCategories();

    async function getCities() {
        let o = `<option value="">Bütün Şəhərlər</option>`;

        await axios.get('/api/cities', {
            params: { site: "BossAz" }
        })
            .then(res => {
                if (res.status === 200) {
                    res.data.forEach(element => {
                        o += `                        
                        <option value="${element.city_id}">${element.name}</option>`
                    })
                    document.getElementById("city-select").innerHTML = o;
                }
            })
            .catch(error => {
                console.error("Error fetching cities:", error);
            });

    }

    getCities();

    async function getStatistics() {
        await axios.get('/statistics')
            .then(res => {  
                if (res.status === 200) {   
                    document.getElementById("vacancy").innerText = res.data.data.vacancy || 0;
                    document.getElementById("company").innerText = res.data.data.company || 0;
                    document.getElementById("visitor").innerText = res.data.data.visitor || 0;
                    // document.getElementById("dailyVisitor").innerText = res.data.data.dailyVisitor || 0;
                    document.getElementById("totalVisitor").innerText = res.data.data.totalVisitor || 0;
                } 
            })
            .catch(error => {
                console.error("Error fetching cities:", error);
            });

    }

    getStatistics();
    document.getElementById("filter-jobs").addEventListener("click", () => {
        const categorySelect = document.getElementById('category-select');
        const citySelect = document.getElementById('city-select');
        const keywordInput = document.getElementById('keyword');

        const category_id = categorySelect?.value || 'all';
        const city_id = citySelect?.value || 'all';
        const keyword = keywordInput?.value?.trim().toLowerCase() || '';

        const baseUrl = `${window.location.origin}/vakansiyalar`;
        const params = new URLSearchParams({
            min_salary: 0,
            max_salary: 5000,
            offset: 0,
            ...(category_id && { category_id }),
            ...(city_id && { city_id }),
            ...(keyword && { keyword }),
        });


        window.location.href = `${baseUrl}?${params.toString()}`;
    });

});
