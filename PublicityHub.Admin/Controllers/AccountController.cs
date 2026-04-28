using Microsoft.AspNetCore.Mvc;

public class AccountController : Controller
{
    // GET: /Account/Login
    public IActionResult Login()
    {
        return View();
    }

    // POST: /Account/Login
    [HttpPost]
    public IActionResult Login(string phoneNumber)
    {
        // HARD DEBUG: confirm POST hits here
        Console.WriteLine("LOGIN POST HIT");
        Console.WriteLine("PHONE: " + phoneNumber);

        // TEMP: bypass auth completely
        HttpContext.Session.SetString("IS_ADMIN", "true");

        return RedirectToAction("Index", "Dashboard");
    }

    public IActionResult Logout()
    {
        HttpContext.Session.Clear();
        return RedirectToAction("Login");
    }

}
