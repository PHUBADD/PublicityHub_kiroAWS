using Microsoft.AspNetCore.Mvc;
using PublicityHub.Admin.Models;
using System.Text.Json;

public class JobAssignmentController : Controller
{
    private readonly IHttpClientFactory _factory;

    public JobAssignmentController(IHttpClientFactory factory)
    {
        _factory = factory;
    }

    // GET: /JobAssignment/Assign/{campaignId}

    public IActionResult Assign(int id)
    {
        var model = new CreateJobAssignmentViewModel
        {
            CampaignId = id
        };

        return View(model);
    }


    // POST: /JobAssignment/Assign
    [HttpPost]
    public async Task<IActionResult> Assign(CreateJobAssignmentViewModel model)
    {
        var client = _factory.CreateClient("PublicityHubApi");

        var response = await client.PostAsJsonAsync(
            "/api/jobassignments/assign",
            model
        );

        if (!response.IsSuccessStatusCode)
        {


            var error = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"❌ API Error: {response.StatusCode} → {error}");

            if (error.Contains("unique_worker_campaign"))
            {
                ModelState.AddModelError(
                    "",
                    "⚠️ This worker is already assigned to this campaign."
                );
            }
            else
            {
                ModelState.AddModelError(
                    "",
                    "❌ Unable to assign worker."
                );
            }

            return View(model);


        }

        return RedirectToAction("Index", "Dashboard");
    }
}