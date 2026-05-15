using Microsoft.AspNetCore.Mvc;
using PublicityHub.Admin.Models;
using PublicityHub.Domain.Entities;

public class AccountController : Controller
{
    private readonly IHttpClientFactory _factory;
    public AccountController(IHttpClientFactory factory)
    {
        _factory = factory;
    }
    // GET: /Account/Login
    public IActionResult Login()
    {
        return View();
    }

    public IActionResult Register()
    {
        return View();
    }

    // POST: /Account/Login
    [HttpPost]

    public async Task<IActionResult> Login(string phoneNumber)
    {
        var client = _factory.CreateClient("PublicityHubApi");

        var response = await client.PostAsJsonAsync(
            "/api/users/login",
            new { phoneNumber }
        );

        if (!response.IsSuccessStatusCode)
        {
            ModelState.AddModelError("", "User not found");
            return View();
        }

        var result = await response.Content.ReadFromJsonAsync<LoginResponse>();

        // ✅ NOW user exists
        HttpContext.Session.SetInt32("UserId", result.User.Id);
        HttpContext.Session.SetString("Role", result.User.Role);

        // ✅ THIS IS THE MISSING STEP
        HttpContext.Session.SetString("token", result.Token);

        if (result.User.Role?.Trim().ToLower() == "worker")
            return RedirectToAction("Dashboard", "Worker");

        return RedirectToAction("Index", "Dashboard");
    }

    public IActionResult Logout()
    {
        HttpContext.Session.Clear();
        return RedirectToAction("Login");
    }
    public IActionResult SetLanguage(string lang)
    {
        HttpContext.Session.SetString("LANG", lang);
        return Redirect(Request.Headers["Referer"].ToString());
    }
}
