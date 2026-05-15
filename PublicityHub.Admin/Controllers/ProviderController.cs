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
        public async Task<IActionResult> Dashboard()
        {
            var client = _factory.CreateClient("PublicityHubApi");

            var campaigns = await client
                .GetFromJsonAsync<List<CampaignViewModel>>("/api/campaigns");

            if (campaigns == null)
                return View(new List<CampaignViewModel>());

            // ✅ SAFE PARSE
            var userIdStr = Request.Query["userId"].ToString();

            if (!int.TryParse(userIdStr, out int currentUserId))
            {
                Console.WriteLine("❌ Invalid userId");
                return View(new List<CampaignViewModel>());
            }

            Console.WriteLine("✅ CurrentUserId: " + currentUserId);

            // ✅ FILTER CORRECTLY
            var filtered = campaigns
                .Where(c => c.CreatedBy == currentUserId)
                .ToList();

            Console.WriteLine("✅ Filtered Count: " + filtered.Count);

            return View(filtered);
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