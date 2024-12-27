import { capitalizeFirstLetter } from './Helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
    alertify.set('notifier', 'position', 'top-right');

    async function getJobs() {
        await axios.get('/api/jobs', {
            params: { categoryId: document.getElementById('categoryId').value }
        }).then(res => {
            let htmlContent = '';

            if (res.status === 200) {
                // alert(res.data.jobs.length);
                if (res.data.totalCount) {
                    let data = res.data.jobs.slice(0, 12);
                    data.forEach(element => {
                        htmlContent += `<div class="job-card bg-white px-3 pt-2 h-36 lg:h-40 rounded-xl shadow-md hover:hover-card-color cursor-pointer duration-300 border border-custom lg:px-5" data-original-link="${element.redirectUrl}">
                            <div class="content flex">
                                 <div class="mt-2 flex-shrink-0 lg:mt-1">
                                    <img src="../Images/${element.sourceUrl}.png" alt="Company Logo" class="border-custom h-12 w-12 mt-1 rounded-lg border lg:h-14 lg:w-14" />
                                <img src="${(element.companyImageUrl && element.companyImageUrl !== "/nologo.png" && !element.companyImageUrl.startsWith('http')) ? element.companyImageUrl.replace(/src\/Public/g, '..') : (element.companyImageUrl && element.companyImageUrl.startsWith('http') ? element.companyImageUrl : "../Images/DefaultCompany.png")}" alt="Company Logo" class="border-custom h-12 w-12 mt-3 rounded-lg border lg:h-14 lg:w-14" />
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
                                                <h4 class=" text-gray-600 hidden lg:block ${!element.minSalary && !element.maxSalary ? "font-semibold text-base" : "font-bold text-lg"}">
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
                                            <h4 class="truncate lg:hidden text-sm font-semibold text-gray-700 mb-1"> 
                                                <i class="fa-solid fa-building"></i> ${capitalizeFirstLetter(element.companyName.slice(0, 17)) + (element.companyName.length > 17 ? "..." : "")}
                                            </h4>
                                            <h4 class="hidden lg:inline lg:whitespace-normal text-sm font-semibold text-gray-700 mb-1"> 
                                                <i class="fa-solid fa-building"></i> ${capitalizeFirstLetter(element.companyName.slice(0, 32)) + (element.companyName.length > 32 ? "..." : "")}
                                            </h4>
                                        </div>
                                        <div class="hidden lg:w-full">
                                            <span class="bg-yellow-100 text-yellow-700 px-1 ml-2 py-0.5 rounded-lg text-sm w-auto">
                                                ${element.sourceUrl}
                                            </span>
                                        </div>                                    
                                    </div>
                                    <div class="flex text-sm text-gray-600">
                                        <span><i class="fa-solid fa-clock mr-0.5"></i> ${element.postedAt.slice(0, 10)}</span>
                                        <span class="ml-3"><i class="fa-solid fa-location-dot mr-0.5"></i> ${element.location.slice(0, 10) + (element.location.length > 10 ? "..." : "")}</span>
                                    </div>
                                    <div class="border-custom-top w-52 mt-2 lg:w-72"></div>
                                        <div class="text-sm mt-2 hidden lg:flex items-center justify-between">
                                          <div class="flex">  <span class="bg-yellow-100 text-yellow-700 px-2 py-0.5 font-medium rounded-lg text-sm h-7 hidden lg:flex">
                                                ${element.sourceUrl}
                                            </span>
                                             ${element.isPremium ? `<span class="bg-orange-500 text-white px-2 ml-1 py-0.5 rounded-lg">premium</span>` : ''}
                                            <span class="bg-green-400 text-white px-2 ml-1  py-0.5 rounded-lg">aktivdir</span></div>
                                            <div class="flex justify-end items-end mt-auto">
                                        <p class="filled-button-color text-white py-2 px-8 rounded-full">
                                            Keçid Et  
                                        </p>
                                    </div>
                                            </div>
                                    <div class="text-sm mt-2 flex justify-between lg:hidden">
                                       <span class="bg-blue-100 text-blue-700 px-1 py-0.5 rounded-lg text-sm">${element.sourceUrl}</span>
                                    <h4 class="text-gray-600 ${!element.minSalary && !element.maxSalary ? "font-semibold text-base" : "font-bold text-lg"}">
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

    document.getElementById('copyLinkButton').addEventListener('click', function () {
        const copyText = window.location.href;
        navigator.clipboard.writeText(copyText).then(function () {
            alertify.success('Link kopyalandı');
        }).catch(function () {
            alertify.success('Link kopyalana bilmədi');
        });
    });
});