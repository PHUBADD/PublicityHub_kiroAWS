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

    public IActionResult Dashboard()
    {
        return View();
    }


    // GET: /Worker/UploadProof/{assignmentId}
    public IActionResult UploadProof(int id)
    {
        ViewBag.AssignmentId = id;
        return View();
    }
}
