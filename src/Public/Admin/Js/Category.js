document.addEventListener("DOMContentLoaded", (event) => {
    console.log("aaaaaaaaaa");

    function getCategories() {
        axios.get('/api/categories')
            .then(res => {
                let htmlContent = "";
                console.log({ res });
    
                if (res.status === 200) {
                    let no = 1;
                    res.data.localCategories.forEach(element => {
                        htmlContent += ` <tr class="bg-white border-b hover:bg-gray-50 " id="row-${element.id}">
                                            <td class="w-4 p-4">
                                                <div class="flex items-center">
                                                ${no++}
                                                </div>
                                            </td>
                                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                <input type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " value="${element.name}" required />
                                            </th>
                                            <td class="px-6 py-4">
                                                  <select id="parentCategory-${element.id}" class="parentCategory bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                                        ${res.data.foreignCategories
                                                            .filter(category => category.parentId === null) // Valideyn kateqoriyalarını filter edirik
                                                            .map(category => `
                                                                <option value="${category.categoryId}">${category.name}</option>
                                                            `).join('')}
                                                    </select>
                                            </td>
                                            <td class="px-6 py-4">
                                                  <select id="subCategory-${element.id}" class="childCategory bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                                    ${res.data.foreignCategories
                                                        .filter(category => category.parentId === element.categoryId) // İlk yüklemede uşaq kateqoriyaları
                                                        .map(category => `
                                                            <option value="${category.categoryId}">${category.name}</option>
                                                        `).join('')}
                                                    </select>  
                                            </td>
                                            <td class="px-6 py-4">
                                                <select id="siteName-${element.id}" class="siteName bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                              ${Object.entries(res.data.siteWithId).map(([siteName, siteId]) => `
                                                    <option value="${siteId}">${siteName}</option>
                                                `).join('')}
                                                </select>
                                            </td>
                                            <td class="px-6 py-4">
                                                <button type="button" class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2">Purple</button>
                                            </td>
                                        </tr>`;
                    });
                    document.getElementById("categoryBody").innerHTML = htmlContent;
    
                    // Valideyn kateqoriyası dəyişəndə uşaq kateqoriyalarını yenilə
                    document.querySelectorAll(".parentCategory").forEach(select => {
                        select.addEventListener("change", function () {
                            const selectedParentId = this.value;
                            const elementId = this.id.split('-')[1];
                            const childCategorySelect = document.getElementById(`subCategory-${elementId}`);
    
                            // Uşaq kateqoriyaları təmizləyin
                            childCategorySelect.innerHTML = "";
    
                            // Seçilmiş parentId-yə uyğun uşaq kateqoriyaları əlavə edin
                            res.data.foreignCategories.forEach(category => {
                                if (category.parentId == selectedParentId) {
                                    const option = document.createElement("option");
                                    option.value = category.categoryId; // categoryId istifadə edilir
                                    option.text = category.name;
                                    childCategorySelect.appendChild(option);
                                }
                            });
                        });
                    });
    
                    // Sayt dəyişəndə valideyn kateqoriyalarını yenilə
                    document.querySelectorAll(".siteName").forEach(select => {
                        select.addEventListener("change", function () {
                            const selectedSiteId = this.value;
                            const elementId = this.id.split('-')[1];
                            const parentCategorySelect = document.getElementById(`parentCategory-${elementId}`);
                            const childCategorySelect = document.getElementById(`subCategory-${elementId}`);
    
                            // Valideyn kateqoriyaları təmizləyin
                            parentCategorySelect.innerHTML = "";
                            childCategorySelect.innerHTML = ""; // Uşaq kateqoriyaları da təmizlənir
    
                            // Seçilmiş siteId-yə uyğun valideyn kateqoriyaları əlavə edin
                            res.data.foreignCategories.forEach(category => {
                                if (category.websiteId == selectedSiteId && category.parentId === null) {
                                    const option = document.createElement("option");
                                    option.value = category.categoryId; // categoryId istifadə edilir
                                    option.text = category.name;
                                    parentCategorySelect.appendChild(option);
                                }
                            });
    
                            // Seçilmiş parent kateqoriyaları yeniləyin
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