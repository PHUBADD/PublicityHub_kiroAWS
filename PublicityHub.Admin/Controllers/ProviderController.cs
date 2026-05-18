using Microsoft.AspNetCore.Mvc;
using PublicityHub.Admin.Models;

namespace PublicityHub.Admin.Controllers
{
    public class ProviderController : Controller
    {
        private readonly IHttpClientFactory _factory;

        public ProviderController(IHttpClientFactory factory)
        {
            _factory = factory;
        }

        // ===============================
        // ✅ PROVIDER DASHBOARD
        // ===============================

        public IActionResult Dashboard()
        {
            return View();
        }

        // ===============================
        // ✅ REDIRECT CREATE CAMPAIGN
        // ===============================
        public IActionResult CreateCampaign()
        {
            return RedirectToAction("Create", "Campaign");
        }
    }
}