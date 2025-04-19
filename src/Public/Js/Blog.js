console.log('aa')
document.addEventListener("DOMContentLoaded", (event) => {
    function noDataCard() {
        return `<div class="bg-white rounded-xl border border-orange-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                     <svg xmlns="http://www.w3.org/2000/svg" width="33" height="32" viewBox="0 0 33 32" fill="none">
                          <g id="File Search">
                            <path id="Vector" d="M19.9762 4V8C19.9762 8.61954 19.9762 8.92931 20.0274 9.18691C20.2379 10.2447 21.0648 11.0717 22.1226 11.2821C22.3802 11.3333 22.69 11.3333 23.3095 11.3333H27.3095M18.6429 19.3333L20.6429 21.3333M19.3095 28H13.9762C10.205 28 8.31934 28 7.14777 26.8284C5.9762 25.6569 5.9762 23.7712 5.9762 20V12C5.9762 8.22876 5.9762 6.34315 7.14777 5.17157C8.31934 4 10.205 4 13.9762 4H19.5812C20.7604 4 21.35 4 21.8711 4.23403C22.3922 4.46805 22.7839 4.90872 23.5674 5.79006L25.9624 8.48446C26.6284 9.23371 26.9614 9.60833 27.1355 10.0662C27.3095 10.524 27.3095 11.0253 27.3095 12.0277V20C27.3095 23.7712 27.3095 25.6569 26.138 26.8284C24.9664 28 23.0808 28 19.3095 28ZM19.3095 16.6667C19.3095 18.5076 17.8171 20 15.9762 20C14.1352 20 12.6429 18.5076 12.6429 16.6667C12.6429 14.8257 14.1352 13.3333 15.9762 13.3333C17.8171 13.3333 19.3095 14.8257 19.3095 16.6667Z" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                          </g>
                     </svg>
                      <div class="p-5">
                        <h2 class="text-center text-black text-xl font-semibold leading-loose pb-2">Heç bir vakansiya tapılmadı</h2>
                        <p class="text-center text-black text-base font-normal leading-relaxed pb-4">Xahiş edirik filterləri dəyişib <br />yenidən yoxlayın</p>
                      </div>
                 </div>`


    }

    async function getBlogs() {
        await axios.get('/api/blogs').then(res => {
            let htmlContent = '';

            if (res.status === 200) {
                if (res.data.data) {
                    res.data.data.forEach(element => {
                        const words = element.description.split(' ');
                        let shortDesc = words.length > 40
                            ? words.slice(0, 40).join(' ') + '...'
                            : element.description;
                        shortDesc = shortDesc.replace(/<[^>]*>/g, '').slice(0, 150) + '...';

                        const readMinutes = Math.ceil(words.length / 200);

                        const createdAtDate = new Date(element.createdAt);
                        const formattedDate = `${String(createdAtDate.getMonth() + 1).padStart(2, '0')}.${String(createdAtDate.getDate()).padStart(2, '0')}.${createdAtDate.getFullYear()}`;

                        htmlContent += `
                             <div class="bg-white rounded-xl border border-orange-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
    <img src="${element.imageUrl}" alt="Blog Image" class="w-full h-48 object-cover">
    <div class="p-5 flex flex-col flex-1">
        <div class="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6a9 9 0 100 18 9 9 0 000-18z"></path>
                </svg>
                ${readMinutes} dəq oxuma müddəti
            </span>
        </div>
        <a href="${'/blogs/' + element.slug}" target="_blank" class="text-xl font-semibold text-gray-900 mb-2">${element.name}</a>
        <a href="${'/blogs/' + element.slug}" target="_blank" class="text-gray-600 text-sm mb-1 flex-1">${shortDesc}</a>

        <!-- Read More Button (right aligned) -->
        <div class="flex justify-end mb-4">
            <a href="${'/blogs/' + element.slug}" target="_blank" class="text-orange-600 hover:text-orange-800 font-medium text-base">Ətraflı oxu →</a>
        </div>

        <div class="flex items-center justify-between text-sm text-gray-500 mt-auto pt-3 border-t">
            <div class="flex items-center gap-2">
                <img class="w-6 h-6 rounded-full" src="https://i.postimg.cc/y6ZkqDpx/Whats-App-Image-2025-04-19-at-04-29-43.jpg" alt="Author"/>
                Zhala Azimli
            </div>
            <span class="flex items-center gap-1">${formattedDate}</span>
        </div>
    </div>
</div>
`;

                        axios.get(`/blogs/${element.slug}`).then(blogRes => {
                            if (blogRes.status === 200) {
                                console.log('Fetched blog details:', blogRes.data);
                            } else {
                                console.log('Failed to fetch details for the blog with slug:', element.slug);
                            }
                        }).catch(error => {
                            console.error('Error fetching the blog details:', error);
                        });
                    });

                    document.getElementById("blog-card-section").innerHTML = htmlContent;
                } else {
                    document.getElementById("blog-card-section").innerHTML = noDataCard();
                }
            }
        }).catch(error => {
            console.error("Error fetching blogs:", error);
        });
    }

    getBlogs();
});
