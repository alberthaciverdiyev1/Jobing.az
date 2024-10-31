// import axios from 'axios';
document.addEventListener("DOMContentLoaded", (event) => {

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

    function categoryHTML(data, limit = null) {
        let htmlContent = "";
        if (limit) {
            data = data.slice(0, limit);
        }
        data.forEach(element => {

            htmlContent += `
                <div class="flex items-center"> 
                    <input type="radio" name="category" id="${element.localCategoryId}" class="custom-checkbox" />
                    <label for="${element.localCategoryId}" class="text-gray-800">
                        ${element.name}
                        <span class="text-gray-400">(34)</span>
                    </label>
                </div>`;
        });
        return htmlContent;
    }

    function noDataCard() {
        return `<div class="flex items-center justify-center min-h-screen">
                <div class="flex flex-col items-center justify-center w-full max-w-xs mx-auto">
                  <div class="w-20 h-20 mx-auto bg-orange-500 rounded-full shadow-sm flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="33" height="32" viewBox="0 0 33 32" fill="none">
                      <g id="File Search">
                        <path id="Vector" d="M19.9762 4V8C19.9762 8.61954 19.9762 8.92931 20.0274 9.18691C20.2379 10.2447 21.0648 11.0717 22.1226 11.2821C22.3802 11.3333 22.69 11.3333 23.3095 11.3333H27.3095M18.6429 19.3333L20.6429 21.3333M19.3095 28H13.9762C10.205 28 8.31934 28 7.14777 26.8284C5.9762 25.6569 5.9762 23.7712 5.9762 20V12C5.9762 8.22876 5.9762 6.34315 7.14777 5.17157C8.31934 4 10.205 4 13.9762 4H19.5812C20.7604 4 21.35 4 21.8711 4.23403C22.3922 4.46805 22.7839 4.90872 23.5674 5.79006L25.9624 8.48446C26.6284 9.23371 26.9614 9.60833 27.1355 10.0662C27.3095 10.524 27.3095 11.0253 27.3095 12.0277V20C27.3095 23.7712 27.3095 25.6569 26.138 26.8284C24.9664 28 23.0808 28 19.3095 28ZM19.3095 16.6667C19.3095 18.5076 17.8171 20 15.9762 20C14.1352 20 12.6429 18.5076 12.6429 16.6667C12.6429 14.8257 14.1352 13.3333 15.9762 13.3333C17.8171 13.3333 19.3095 14.8257 19.3095 16.6667Z" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                      </g>
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-center text-black text-xl font-semibold leading-loose pb-2">There’s no product here</h2>
                    <p class="text-center text-black text-base font-normal leading-relaxed pb-4">Try changing your filters to <br />see appointments</p>
                  </div>
                </div>
              </div>`
    }

    function cityHTML(data, limit = null) {
        let htmlContent = "";
        if (limit) {
            data = data.slice(0, limit);
        }
        data.forEach(element => {
            htmlContent += `
                <div class="flex items-center">
                    <input type="radio" name="city" id="city-${element.cityId}" data-id="${element.cityId}"" class="custom-checkbox" />
                    <label for="city-${element.cityId}" class="text-gray-800">${element.name} <span class="text-gray-400">(145)</span></label>
                </div>`;
        });
        return htmlContent;
    }



    function getCategories() {
        axios.get('/api/categories')
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
    getCategories();



    async function getCities() {
        await axios.get('/api/cities')
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
    getCities();

    async function getEducation() {
        await axios.get('/education')
            .then(res => {
                let htmlContent = '';
                if (res.status === 200) {
                    Object.entries(res.data).forEach((education) => {
                        htmlContent += `
                      <div class="flex items-center">
                          <input type="radio" name="education" id="education-${education[1]}" data-id="${education[1]}"" class="custom-checkbox" />
                          <label for="education-${education[1]}" class="text-gray-800">${education[0]} <span class="text-gray-400">(145)</span></label>
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
    getEducation();

    async function getExperience() {
        await axios.get('/experience')
            .then(res => {
                let htmlContent = '';
                if (res.status === 200) {
                    Object.entries(res.data).forEach((experience) => {
                        htmlContent += `
                      <div class="flex items-center">
                          <input type="radio" name="experience" id="experience-${experience[1]}" data-id="${experience[1]}"" class="custom-checkbox" />
                          <label for="experience-${experience[1]}" class="text-gray-800">${experience[0]} <span class="text-gray-400">(145)</span></label>
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
    getExperience();

    async function getJobs(params) {
        await axios.get('/api/jobs', {
            params: params
        }).then(res => {
            let htmlContent = '';
            let headerContent = '';
            let loadMoreButton = '';
            if (false) {
                headerContent = `<div class="flex justify-between mb-3 bg-white py-1 px-4 rounded-lg text-center items-center sm:py-2">
                                        <span class="text-sm">500 results</span>
                                        <select name="" id="" class="w-16 rounded-lg h-6 border-custom sm:8 sm:w-32 sm:h-8">
                                            <option value="">aa</option>
                                            <option value="">aa</option>
                                            <option value="">aa</option>
                                            <option value="">aa</option>
                                        </select>
                                    </div>`;
            }

            if (res.status === 200) {
                console.log(res.data);

                if (res.data.totalCount > 0) {
                    res.data.jobs.forEach(element => {
                        htmlContent += `<div class="job-card bg-white px-3 pt-2 h-40 rounded-xl shadow-md mb-4 hover:hover-card-color cursor-pointer duration-300 border border-custom sm:px-5" data-original-link="${element.redirectUrl}">
                                            <div class="content flex">
                                                <div class="mt-3 sm:mt-1">
                                                    <span class="mr-2">
                                                        <img src="../Images/${element.sourceUrl}.png" 
                                                            alt="Company Logo" class="w-12 h-12 rounded-lg sm:w-14 sm:h-14" />
                                                    </span>
                                                    <span class="mr-2">
                                                        <img src="https://smartjob.az/storage/avatars/g8QEttbtJjCDKMlk9iguXKYzDl56fSEacTfjeyH9.png"
                                                            alt="Company Logo" class="w-12 h-12 rounded-lg sm:w-14 sm:h-14" />
                                                    </span>
                                                </div>
                                                <div class="ml-3 mt-2 pr-1 sm:mt-2 sm:w-auto">
                                                    <div class="flex mb-1 justify-between">
                                                        <div class="">
                                                            <p class="text-sm font-bold flex text-gray-700 justify-items-start sm:font-bold sm:text-base">
                                                                <span class="truncate sm:hidden"> 
                                                                    ${element.title.slice(0, 17)} 
                                                                </span>
                                                                <span class="hidden sm:inline sm:whitespace-normal"> 
                                                                    ${element.title} 
                                                                </span>
                                                                <span class="bg-blue-100 text-blue-700 px-1 ml-3 py-0.5 font-medium rounded-lg text-sm h-7 hidden sm:flex">
                                                                    ${element.jobType}
                                                                </span>
                                                                <span class="bg-yellow-100 text-yellow-700 px-1 ml-2 py-0.5 font-medium rounded-lg text-sm h-7 hidden sm:flex">
                                                                    ${element.sourceUrl}
                                                                </span>
                                                            </p>
                                                            <h4 class="text-base font-semibold text-gray-700 mb-2 sm:font-bold">
                                                                <i class="fa-solid fa-building"></i> ${element.companyName}
                                                            </h4>
                                                        </div>
                                                        <div class="hidden sm:w-full">
                                                            <span class="bg-blue-100 text-blue-700 px-1 ml-3 py-0.5 h-12 w-auto rounded-lg text-sm">
                                                                ${element.jobType}
                                                            </span>
                                                            <span class="bg-yellow-100 text-yellow-700 px-1 ml-2 py-0.5 rounded-lg text-sm w-auto">
                                                                ${element.sourceUrl}
                                                            </span>
                                                        </div>
                                                        <button class="text-base text-gray-600 font-bold mb-5 sm:hidden">
                                                            <i class="fa-solid fa-heart text-2xl"></i>
                                                        </button>
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
                                                        <span class="bg-blue-100 text-blue-700 px-1 py-0.5 rounded-lg text-sm">${element.jobType}</span>
                                                        <h4 class="text-lg text-gray-600 font-bold">${(+element.minSalary !== "null" ? +element.minSalary + '-' : "") + +element.maxSalary ?? (!element.minSalary && !element.maxSalary ? "Razilasma ile" : "")}</h4>
                                                    </div>
                                                </div>
                                                <div class="flex flex-col justify-between h-full flex-grow hidden sm:flex">
                                                    <div class="text-right">
                                                        <button class="text-base text-gray-600 font-bold mb-2 w-8 h-8">
                                                            <i class="fa-solid fa-heart text-2xl"></i>
                                                        </button>
                                                        <h4 class="text-lg text-gray-600 font-bold mt-2">${(+element.minSalary ? element.minSalary + '-' : "") + +element.maxSalary ?? (!element.minSalary && !element.maxSalary ? "Razilasma ile" : "")}</h4>
                                                    </div>
                                                    <div class="flex justify-end items-end mt-auto pt-6">
                                                        <a href="${element.redirectUrl}" target="_blank" class="filled-button-color text-white py-2 px-8 rounded-full">
                                                            Visit 
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> `;
                    });

                    loadMoreButton = res.data.totalCount > 50 && !res.data.hideLoadMore ? `<div class="flex justify-center items-center my-2">
                                        <button class="filled-button-color text-white py-2 px-8 rounded-full" id="loadMore">
                                            Load More 
                                        </button>
                                     </div>` : "";
                } else {
                    htmlContent = noDataCard();
                }

                if (offset && res.data.totalCount > 0) {
                    document.getElementById("card-section").insertAdjacentHTML('beforeend', htmlContent + loadMoreButton);
                } else if (res.data.totalCount > 0) {
                    document.getElementById("card-section").innerHTML = headerContent + htmlContent + loadMoreButton;
                }

                const jobCards = document.querySelectorAll('.job-card');
                jobCards.forEach(card => {
                    card.addEventListener('click', function () {
                        const originalLink = this.getAttribute('data-original-link');
                        window.open(originalLink, '_blank');
                    });
                });

                const loadMoreBtn = document.getElementById('loadMore');
                if (loadMoreBtn) {
                    loadMoreBtn.addEventListener('click', function () {
                        loadMoreBtn.classList.add("hidden");
                        offset += 50;
                        handleFilterChange(offset)
                    });
                }
            }
        }).catch(error => {
            console.error("Error fetching jobs:", error);
        });
    }

    getJobs();


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

    function addRadioChangeListener() {
        document.querySelectorAll('input[name="category"]').forEach(radio => {
            radio.addEventListener('change', function () {
                const selectedId = this.id;
                getJobs(selectedId);

            });
        });
    }
    function handleFilterChange(offset_value = 0) {
        const params = {
            categoryId: +document.querySelector('input[name="category"]:checked')?.id || null,
            cityId: +document.querySelector('input[name="city"]:checked')?.getAttribute('data-id') || null,
            educationId: +document.querySelector('input[name="education"]:checked')?.getAttribute('data-id') || null,
            jobType: document.querySelector('input[name="jobType"]:checked')?.id || null,
            minSalary: +minSalary,
            maxSalary: +maxSalary,
            experience: +document.querySelector('input[name="experience"]:checked')?.getAttribute('data-id') || null,
            keyword: document.getElementById("search")?.value || null,
            offset: +offset_value || 0
        };
        // console.log( params );return;

        getJobs(params);
    }


    document.getElementById("search-btn").addEventListener("click", handleFilterChange);
    document.getElementById("search").addEventListener("keyup", handleFilterChange);



    function addRadioChangeListener(type) {
        console.log({ type });

        document.querySelectorAll(`input[name="${type}"]`).forEach(radio => {
            radio.addEventListener('change', function () {
                handleFilterChange();
            });
        });
    }



    function draw(slider, splitvalue) {
        handleFilterChange();
        /* set function vars */
        var min = slider.querySelector(".min");
        var max = slider.querySelector(".max");
        var lower = slider.querySelector(".lower");
        var upper = slider.querySelector(".upper");
        var legend = slider.querySelector(".legend");
        var thumbsize = parseInt(slider.getAttribute("data-thumbsize"));
        var rangewidth = parseInt(slider.getAttribute("data-rangewidth"));
        var rangemin = parseInt(slider.getAttribute("data-rangemin"));
        var rangemax = parseInt(slider.getAttribute("data-rangemax"));

        /* set min and max attributes */
        min.setAttribute("max", splitvalue);
        max.setAttribute("min", splitvalue);

        /* set css */
        min.style.width =
            parseInt(
                thumbsize +
                ((splitvalue - rangemin) / (rangemax - rangemin)) *
                (rangewidth - 2 * thumbsize)
            ) + "px";
        max.style.width =
            parseInt(
                thumbsize +
                ((rangemax - splitvalue) / (rangemax - rangemin)) *
                (rangewidth - 2 * thumbsize)
            ) + "px";
        min.style.left = "0px";
        max.style.left = parseInt(min.style.width) + "px";
        lower.style.top = lower.offsetHeight + "px";
        upper.style.top = upper.offsetHeight + "px";
        legend.style.marginTop = min.offsetHeight + "px";
        slider.style.height =
            lower.offsetHeight + min.offsetHeight + legend.offsetHeight + "px";

        /* write value and labels */
        max.value = max.getAttribute("data-value");
        min.value = min.getAttribute("data-value");
        minSalary = min.value;
        maxSalary = max.value;
        lower.innerHTML = min.getAttribute("data-value");
        upper.innerHTML = max.getAttribute("data-value");
    }

    function init(slider) {
        /* set function vars */
        var min = slider.querySelector(".min");
        var max = slider.querySelector(".max");
        var rangemin = parseInt(min.getAttribute("min"));
        var rangemax = parseInt(max.getAttribute("max"));
        var avgvalue = (rangemin + rangemax) / 2;
        var legendnum = slider.getAttribute("data-legendnum");

        /* set data-values */
        min.setAttribute("data-value", rangemin);
        max.setAttribute("data-value", rangemax);

        /* set data vars */
        slider.setAttribute("data-rangemin", rangemin);
        slider.setAttribute("data-rangemax", rangemax);
        slider.setAttribute("data-thumbsize", thumbsize);
        slider.setAttribute("data-rangewidth", slider.offsetWidth);

        /* write legend */
        var legend = document.createElement("s");
        legend.classList.add("legend");
        var legendvalues = [];
        for (var i = 0; i < legendnum; i++) {
            legendvalues[i] = document.createElement("div");
            var val = Math.round(
                rangemin + (i / (legendnum - 1)) * (rangemax - rangemin)
            );
            legendvalues[i].appendChild(document.createTextNode(val));
            legend.appendChild(legendvalues[i]);
        }
        console.log(legend);

        slider.appendChild(legend);

        /* draw */
        draw(slider, avgvalue);

        /* events */
        min.addEventListener("input", function () {
            update(min);
        });
        max.addEventListener("input", function () {
            update(max);
        });
    }

    function update(el) {
        var slider = el.parentElement;
        var min = slider.querySelector("#min");
        var max = slider.querySelector("#max");
        var minvalue = Math.floor(min.value);
        var maxvalue = Math.floor(max.value);

        min.setAttribute("data-value", minvalue);
        max.setAttribute("data-value", maxvalue);

        var avgvalue = (minvalue + maxvalue) / 2;

        draw(slider, avgvalue);
    }

    var sliders = document.querySelectorAll(".min-max-slider");
    sliders.forEach(function (slider) {
        init(slider);
    });
});