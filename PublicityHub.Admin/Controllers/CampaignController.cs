using Microsoft.AspNetCore.Mvc;
using PublicityHub.Admin.Models;

public class CampaignController : Controller
{
    private readonly IHttpClientFactory _factory;

    public CampaignController(IHttpClientFactory factory)
    {
        _factory = factory;
    }

    // ===============================
    // ✅ GET: /Campaign/Create
    // ===============================
    public IActionResult Create()
    {
        return View();
    }

    // ===============================
    // ✅ POST: /Campaign/Create
    // ===============================
    [HttpPost]
    public async Task<IActionResult> Create(CreateCampaignViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return View(model);
        }

        // ✅ FORCE CreatedBy from form (guarantee value)
        var createdByStr = Request.Form["CreatedBy"].ToString();

        if (!string.IsNullOrEmpty(createdByStr))
        {
            model.CreatedBy = int.Parse(createdByStr);
    }

        var client = _factory.CreateClient("PublicityHubApi");

        var response = await client.PostAsJsonAsync("/api/Campaigns", model);

        if (!response.IsSuccessStatusCode)
        {
            ModelState.AddModelError("", "❌ Failed to create campaign");
            return View(model);
        }

        var role = Request.Form["Role"].ToString();

        if (role?.ToLower() == "provider")
        {
            return RedirectToAction("Dashboard", "Provider", new { userId = model.CreatedBy });
        }

        return RedirectToAction("Index", "Dashboard");
    }
}
