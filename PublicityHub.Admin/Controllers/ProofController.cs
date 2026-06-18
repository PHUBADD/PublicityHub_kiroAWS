using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

public class ProofController : Controller
{
    private readonly IHttpClientFactory _factory;

    public ProofController(IHttpClientFactory factory)
    {
        _factory = factory;
    }

    // GET: /Proof/Index — all proofs
    public async Task<IActionResult> Index()
    {
        var client = AuthenticatedHttpClient.Create(_factory, HttpContext);
        var response = await client.GetAsync("/api/Proofs");

        if (!response.IsSuccessStatusCode)
        {
            ViewBag.Error = $"Failed to load proofs (HTTP {(int)response.StatusCode})";
            return View(new List<ProofViewModel>());
        }

        var json = await response.Content.ReadAsStringAsync();
        if (string.IsNullOrWhiteSpace(json))
            return View(new List<ProofViewModel>());

        var proofs = JsonSerializer.Deserialize<List<ProofViewModel>>(
            json,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
        ) ?? new List<ProofViewModel>();

        return View(proofs);
    }

    // POST: /Proof/Approve/{id}
    [HttpPost]
    public async Task<IActionResult> Approve(int id)
    {
        return await Review(id, "approve");
    }

    // POST: /Proof/Reject/{id}
    [HttpPost]
    public async Task<IActionResult> Reject(int id)
    {
        return await Review(id, "reject");
    }

    private async Task<IActionResult> Review(int id, string action)
    {
        var client = AuthenticatedHttpClient.Create(_factory, HttpContext);
        var response = await client.PostAsync($"/api/Proofs/{id}/{action}", null);

        if (!response.IsSuccessStatusCode)
            TempData["Error"] = "Action failed";
        else
            TempData["Success"] = action == "approve" ? "Proof approved!" : "Proof rejected.";

        return RedirectToAction(nameof(Index));
    }

    // GET: /Proof/ByCampaign/{id}
    public async Task<IActionResult> ByCampaign(int id)
    {
        var client = AuthenticatedHttpClient.Create(_factory, HttpContext);
        var response = await client.GetAsync($"/api/Proofs/campaign/{id}");

        if (!response.IsSuccessStatusCode)
        {
            ViewBag.Error = $"Failed to load proofs (HTTP {(int)response.StatusCode})";
            return View(new List<ProofViewModel>());
        }

        var json = await response.Content.ReadAsStringAsync();
        if (string.IsNullOrWhiteSpace(json))
            return View(new List<ProofViewModel>());

        var proofs = JsonSerializer.Deserialize<List<ProofViewModel>>(
            json,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
        ) ?? new List<ProofViewModel>();

        ViewBag.CampaignId = id;
        return View(proofs);
    }
}
