document.addEventListener("DOMContentLoaded", (event) => {
    alertify.set('notifier', 'position', 'top-right');
    document.getElementById('addJob').addEventListener("click", () => {
        let data = {
            email:document.getElementById("#email").value,
            username:document.getElementById("#username").value,
            phone1:document.getElementById("#phone1").value,
            phone2:document.getElementById("#phone2").value,
            companyName:document.getElementById("#company-name").value,
            companyImage:document.getElementById("#company-image").value,
        }

        console.log({data});
        
    });
    
});
