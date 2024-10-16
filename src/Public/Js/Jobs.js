// import axios from 'axios';
document.addEventListener("DOMContentLoaded", (event) => {

    var thumbsize = 14;
    let categoryArray = [], cityArray = [];
    let showMoreCategories = true;
    let showMoreCities = true;

    function categoryHTML(data, limit = null) {
        let htmlContent = "";
        if (limit) {
            data = data.slice(0, limit);
        }
        data.forEach(element => {
            htmlContent += `
            <div class="flex items-center">
                <input type="checkbox" id="${element.id}" class="custom-checkbox" />
                <label for="${element.id}" class="text-gray-800">
                    ${element.name}
                    <span class="text-gray-400">(34)</span>
                </label>
            </div>`;
        });
        return htmlContent;
    }

    function cityHTML(data, limit = null) {
        let htmlContent = "";
        if (limit) {
            data = data.slice(0, limit);
        }
        data.forEach(element => {
            htmlContent += ` <div class="flex items-center">
                            <input type="checkbox" id="${element.id}" class="custom-checkbox" />
                            <label for="${element.id}" class="text-gray-800">${element.name} <span class="text-gray-400">(145)</span></label>
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
                }
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });

    }
    getCities();


    document.getElementById("show-more-categories").addEventListener("click", function () {
        if (showMoreCategories) {
            document.getElementById("categoryList").innerHTML = categoryHTML(categoryArray);
            this.textContent = "Show Less";
            showMoreCategories = false;
        } else {
            document.getElementById("categoryList").innerHTML = categoryHTML(categoryArray, 10);
            this.textContent = "Show More";
            showMoreCategories = true;
        }
    });

    document.getElementById("show-more-cities").addEventListener("click", function () {
        if (showMoreCities) {
            document.getElementById("cityList").innerHTML = cityHTML(cityArray);
            this.textContent = "Show Less";
            showMoreCities = false;
        } else {
            document.getElementById("cityList").innerHTML = cityHTML(cityArray, 10);
            this.textContent = "Show More";
            showMoreCities = true;
        }
    });


    function draw(slider, splitvalue) {
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