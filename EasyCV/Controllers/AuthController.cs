using Microsoft.AspNetCore.Mvc;

namespace EasyCV.Controllers
{
    public class AuthController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
         public IActionResult Profile()
        {
            return View();  
        }
    }
}
