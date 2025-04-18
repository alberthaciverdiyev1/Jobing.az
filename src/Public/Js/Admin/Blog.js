document.addEventListener('DOMContentLoaded', async () => {
    alertify.set('notifier', 'position', 'top-right');
});
let editorDescription = null;
let allValid = true;
let data = {};


ClassicEditor
    .create(document.querySelector('#description'), {})
    .then(editor => {
        editor.ui.view.editable.element.style.height = '100px';
        editorDescription = editor;
    })
    .catch(error => {
        console.error(error);
    });



async function validateData(data) {
    allValid = true;
    const validatedData = { ...data };


    // DOM updates
    Object.keys(data).forEach((key) => {
        if (key === "image") return;

        const element = document.getElementById(key);
        if (!element) return;
        if (key === "description" && !data[key]) document.getElementById("description-error").classList.remove("hidden");

        const errorMessage = element.closest("div").querySelector("span");

        if (!data[key]) {
            if (errorMessage) {
                errorMessage.classList.remove("hidden");
            }
            element.classList.add("border-red-500");
            allValid = false;
        } else {
            if (errorMessage) {
                errorMessage.classList.add("hidden");
                if (key === "description") document.getElementById("description-error").classList.add("hidden");
            }
            element.classList.remove("border-red-500");
        }
    });

    return { allValid, validatedData };
}

document.getElementById('addBlog').addEventListener("click", async () => {
    try {
        const image = document.getElementById("image");
        let imageBase64 = null;

        if (image?.files?.[0]) {
            imageBase64 = await fileToBase64(image.files[0]);
        }
        const descriptionEditorData = editorDescription ? await editorDescription.getData() : '';

        const data = {
            name: document.getElementById("name")?.value.trim(),
            description: descriptionEditorData,
            status: document.getElementById("status")?.value.trim(),
            imageUrl: imageBase64,

        };

        // const { allValid, validatedData } = await validateData(data);
        // console.log({ allValid, validatedData });
        // if (allValid) {
        if (true){
            // const response = await axios.post('/api/blog/add', { data: validatedData });
            const response = await axios.post('/api/blog/add', { data: data });
            if (response.data.status === 201) {
                location.reload();
            } else {
                alertify.error(response.data.message);
            }
        } else {
            alertify.error("Zəhmət olmasa bütün məcburi xanaları doldurun!");
        }
    } catch (error) {
        alertify.error("Xəta baş verdi, zəhmət olmasa yenidən cəhd edin.");
        console.error(error);
    }
});

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}
