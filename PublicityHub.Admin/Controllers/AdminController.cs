using Microsoft.AspNetCore.Mvc;

namespace PublicityHub.Admin.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Vision()
        {
            return View();
        }
    }
}
