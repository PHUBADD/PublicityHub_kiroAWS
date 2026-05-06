using Microsoft.AspNetCore.Mvc;
using PublicityHub.Admin.Models;
using System.Text.Json;

public class WorkerController : Controller
{
    private readonly IHttpClientFactory _factory;

    public WorkerController(IHttpClientFactory factory)
    {
        _factory = factory;
    }

    // GET: /Worker/Dashboard
    public async Task<IActionResult> Dashboard()
    {
        var workerId = HttpContext.Session.GetInt32("UserId");
        var role = HttpContext.Session.GetString("Role")?.Trim().ToLower();

        if (workerId == null)
            return RedirectToAction("Login", "Account");

        if (role != "worker")
            return RedirectToAction("Index", "Dashboard");

        var client = _factory.CreateClient("PublicityHubApi");

        var response = await client.GetAsync(
            $"/api/jobassignments/worker/{workerId}"
        );

        var json = await response.Content.ReadAsStringAsync();

        var assignments = JsonSerializer.Deserialize<List<WorkerAssignmentViewModel>>(
            json,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
        ) ?? new List<WorkerAssignmentViewModel>();

        return View(assignments);
    }

    // GET: /Worker/UploadProof/{assignmentId}
    public IActionResult UploadProof(int id)
    {
        ViewBag.AssignmentId = id;
        return View();
    }
}
