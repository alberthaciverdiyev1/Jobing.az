document.addEventListener("DOMContentLoaded", (event) => {
console.log("aaaaaaaaaa");

    function getCategories() {
        axios.get('/api/categories')
            .then(res => {
                let htmlContent = "";
                if (res.status === 200) {
                    let no = 0;
                    res.data.forEach(element => {
                        htmlContent += ` <tr class="bg-white border-b hover:bg-gray-50 ">
                                            <td class="w-4 p-4">
                                                <div class="flex items-center">
                                                ${no++}
                                                </div>
                                            </td>
                                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                ${element.name}
                                            </th>
                                            <td class="px-6 py-4">
                                                Silver
                                            </td>
                                            <td class="px-6 py-4">
                                                Laptop
                                            </td>
                                            <td class="px-6 py-4">
                                                $2999
                                            </td>
                                            <td class="px-6 py-4">
                                                <a href="#" class="font-medium text-blue-600 hover:underline">Edit</a>
                                            </td>
                                        </tr>`;
                    });
                    document.getElementById("categoryBody").innerHTML = htmlContent;
                }
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });

    }
    getCategories();


});