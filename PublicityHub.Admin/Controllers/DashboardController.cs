using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

public class DashboardController : Controller
{
    private readonly IHttpClientFactory _factory;

    public DashboardController(IHttpClientFactory factory)
    {
        _factory = factory;
    }

    public async Task<IActionResult> Index()
    {
        var client = _factory.CreateClient("PublicityHubApi");

        var response = await client.GetAsync("/api/Campaigns");

        if (!response.IsSuccessStatusCode)
        {
            ViewBag.Error = "Unable to load campaigns";
            return View(new List<CampaignViewModel>());
        }

        var json = await response.Content.ReadAsStringAsync();

        var campaigns = JsonSerializer.Deserialize<List<CampaignViewModel>>(
            json,
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }
        ) ?? new List<CampaignViewModel>();

        // ✅ THIS IS THE KEY LINE YOU WERE MISSING
        return View(campaigns);
    }

}