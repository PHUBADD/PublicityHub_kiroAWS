using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using PublicityHub.Admin.Models;

[Route("Dashboard")]
public class DashboardController : Controller
{
    private readonly IHttpClientFactory _factory;

    public DashboardController(IHttpClientFactory factory)
    {
        _factory = factory;
    }

    [HttpGet("")]
    [HttpGet("Index")]
    public async Task<IActionResult> Index()
    {
        var client = AuthenticatedHttpClient.Create(_factory, HttpContext);

        // Fetch campaigns
        var campaignResponse = await client.GetAsync("/api/Campaigns/all");
        if (!campaignResponse.IsSuccessStatusCode)
        {
            ViewBag.Error = "Unable to load campaigns";
            return View(new List<CampaignViewModel>());
        }

        var campaignJson = await campaignResponse.Content.ReadAsStringAsync();
        var campaigns = JsonSerializer.Deserialize<List<CampaignViewModel>>(
            campaignJson,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
        ) ?? new List<CampaignViewModel>();

        // Fetch proof counts and merge into campaigns
        try
        {
            var proofCountResponse = await client.GetAsync("/api/Campaigns/proof-counts");
            if (proofCountResponse.IsSuccessStatusCode)
            {
                var pcJson = await proofCountResponse.Content.ReadAsStringAsync();
                var proofCounts = JsonSerializer.Deserialize<List<ProofCountViewModel>>(
                    pcJson,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                ) ?? new List<ProofCountViewModel>();

                foreach (var c in campaigns)
                {
                    var pc = proofCounts.FirstOrDefault(x => x.CampaignId == c.Id);
                    if (pc != null)
                    {
                        c.TotalProofs = pc.TotalProofs;
                        c.PendingProofs = pc.PendingProofs;
                    }
                }
            }
        }
        catch { /* proof counts are optional — don't fail page */ }

        return View(campaigns);
    }
}
