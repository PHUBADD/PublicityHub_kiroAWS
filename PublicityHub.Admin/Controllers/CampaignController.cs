using Microsoft.AspNetCore.Mvc;
using PublicityHub.Admin.Models;
using System.Text.Json;

public class CampaignController : Controller
{
    private readonly IHttpClientFactory _factory;

    public CampaignController(IHttpClientFactory factory)
    {
        _factory = factory;
    }

    // GET: /Campaign/Create
    public IActionResult Create()
    {
        return View();
    }

    // POST: /Campaign/Create
    [HttpPost]
    public async Task<IActionResult> Create(CreateCampaignViewModel model)
    {
        var client = _factory.CreateClient("PublicityHubApi");

        var response = await client.PostAsJsonAsync(
            "/api/Campaigns",
            model
        );

        if (!response.IsSuccessStatusCode)
        {
            ModelState.AddModelError("", "Failed to create campaign");
            return View(model);
        }

        return RedirectToAction("Index", "Dashboard");
    }
}
