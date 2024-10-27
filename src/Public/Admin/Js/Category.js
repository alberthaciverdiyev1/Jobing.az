document.addEventListener("DOMContentLoaded", (event) => {
    console.log("aaaaaaaaaa");

    function getCategories() {
        axios.get('/api/categories')
            .then(res => {
                let htmlContent = "";
                let headHtml ="";
                console.log({ res });

                if (res.status === 200) {
                    let n = 1;
                    headHtml = `<tr class="bg-white border-b hover:bg-gray-50">
                                         <td class="w-4 p-4">
                                             <div class="flex items-center">
                                             </div>
                                         </td>
                                         <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                             <input type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
                                         </th>
                                         <td class="px-6 py-4">
                                             <select id="parentCategory" class="parentCategory bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                                 ${res.data.foreignCategories.filter(category => category.parentId === null)
                                                     .map(category => `
                                                         <option value="${category.categoryId}">${category.name}</option>
                                                     `).join('')}
                                             </select>
                                         </td>
                                         <td class="px-6 py-4">
                                             <select id="subCategory" class="childCategory bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                                 ${res.data.foreignCategories.map(category => ` 
                                                         <option value="${category.categoryId}">${category.name}</option>
                                                     `).join('')}
                                             </select>
                                         </td>
                                         <td class="px-6 py-4">
                                             <select id="siteName" class="siteName bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                                 ${Object.entries(res.data.siteWithId).map(([siteName, siteId]) => `
                                                     <option value="${siteId}">${siteName}</option>
                                                 `).join('')}
                                             </select>
                                         </td>
                                         <td class="px-6 py-4">
                                             <button type="button" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2">Add</button>
                                         </td>
                                     </tr>`;
                    res.data.localCategories.forEach(element => {
                         htmlContent += `<tr class="bg-white border-b hover:bg-gray-50" id="row-${element.id}">
                                            <td class="w-4 p-4">
                                                <div class="flex items-center">
                                                    ${n++}
                                                </div>
                                            </td>
                                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                <input type="text" id="first_name-${element.id}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value="${element.name}" required />
                                            </th>
                                            <td class="px-6 py-4">
                                                <input type="text" id="first_name-${element.id}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value="${element.name}" required />

                                            </td>
                                            <td class="px-6 py-4">
                                                <input type="text" id="first_name-${element.id}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value="${element.name}" required />

                                            </td>
                                            <td class="px-6 py-4">
                                                <input type="text" id="first_name-${element.id}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value="${element.name}" required />
                                            </td>
                                             <td class="px-6 py-4">
                                                <input type="text" id="first_name-${element.id}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value="${element.name}" required />
                                            </td>
                                            <td class="px-6 py-4">
                                                <input type="text" id="first_name-${element.id}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value="${element.name}" required />
                                            </td>
                                           <td class="px-6 py-4">
                                                <input type="text" id="first_name-${element.id}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value="${element.name}" required />
                                            </td>
                                            <td class="px-6 py-4">
                                                <button type="button" class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2">Purple</button>
                                            </td>
                                        </tr>`;
                    });
                    console.log(headHtml+htmlContent);

                    document.getElementById("categoryBody").innerHTML = headHtml + htmlContent; 

                    document.querySelectorAll(".parentCategory").forEach(select => {
                        select.addEventListener("change", function () {
                            const selectedParentId = this.value;
                            const elementId = this.id.split('-')[1];
                            const childCategorySelect = document.getElementById(`subCategory-${elementId}`);

                            const selectedSiteId = document.querySelector(`#siteName-${elementId}`).value;
                            console.log({ selectedSiteId });

                            childCategorySelect.innerHTML = "";

                            res.data.foreignCategories.forEach(category => {
                                if (category.parentId == selectedParentId && category.websiteId == selectedSiteId) {
                                    const option = document.createElement("option");
                                    option.value = category.categoryId;
                                    option.text = category.name;
                                    childCategorySelect.appendChild(option);
                                }
                            });
                        });
                    });

                    document.querySelectorAll(".siteName").forEach(select => {
                        select.addEventListener("change", function () {
                            const selectedSiteId = this.value;
                            const elementId = this.id.split('-')[1];
                            const parentCategorySelect = document.getElementById(`parentCategory-${elementId}`);
                            const childCategorySelect = document.getElementById(`subCategory-${elementId}`);

                            parentCategorySelect.innerHTML = "";
                            childCategorySelect.innerHTML = "";

                            res.data.foreignCategories.forEach(category => {
                                if (category.websiteId == selectedSiteId && category.parentId === null) {
                                    const option = document.createElement("option");
                                    option.value = category.categoryId;
                                    option.text = category.name;
                                    parentCategorySelect.appendChild(option);
                                }
                            });

                            parentCategorySelect.dispatchEvent(new Event('change'));
                        });
                    });
                }
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });
    }

    getCategories();
});