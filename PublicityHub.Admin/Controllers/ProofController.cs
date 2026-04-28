using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

public class ProofController : Controller
{
    private readonly IHttpClientFactory _factory;

    public ProofController(IHttpClientFactory factory)
    {
        _factory = factory;
    }

    // GET: /Proof
    public async Task<IActionResult> Index()
    {
        var client = _factory.CreateClient("PublicityHubApi");

        var response = await client.GetAsync("/api/Proofs");

        if (!response.IsSuccessStatusCode)
        {
            ViewBag.Error = "Failed to load proofs";
            return View(new List<ProofViewModel>());
        }

        var json = await response.Content.ReadAsStringAsync();

        if (string.IsNullOrWhiteSpace(json))
        {
            return View(new List<ProofViewModel>());
        }

        var proofs = JsonSerializer.Deserialize<List<ProofViewModel>>(
            json,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
        ) ?? new List<ProofViewModel>();

        return View(proofs);
    }

    [HttpPost]
    public async Task<IActionResult> Approve(int id)
    {
        return await Review(id, "approve");
    }

    [HttpPost]
    public async Task<IActionResult> Reject(int id)
    {
        return await Review(id, "reject");
    }

    private async Task<IActionResult> Review(int id, string action)
    {
        var client = _factory.CreateClient("PublicityHubApi");

        // JWT intentionally disabled for now
        await client.PostAsync($"/api/Proofs/{action}/{id}", null);

        return RedirectToAction(nameof(Index));
    }

    // GET: /Proof/ByCampaign/5
    public async Task<IActionResult> ByCampaign(int id)
    {
        var client = _factory.CreateClient("PublicityHubApi");

        var response = await client.GetAsync($"/api/Proofs/campaign/{id}");

        if (!response.IsSuccessStatusCode)
        {
            ViewBag.Error = "Failed to load proofs";
            return View(new List<ProofViewModel>());
        }

        var json = await response.Content.ReadAsStringAsync();

        if (string.IsNullOrWhiteSpace(json))
        {
            return View(new List<ProofViewModel>());
        }

        var proofs = JsonSerializer.Deserialize<List<ProofViewModel>>(
            json,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
        ) ?? new List<ProofViewModel>();

        ViewBag.CampaignId = id;
        return View(proofs);
    }
}