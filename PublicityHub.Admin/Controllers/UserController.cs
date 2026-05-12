using Microsoft.AspNetCore.Mvc;
using PublicityHub.Admin.Models;
using System.Net.Http;

namespace PublicityHub.Admin.Controllers
{
    public class UserController : Controller
    {
        private readonly IHttpClientFactory _factory;

        public UserController(IHttpClientFactory factory)
        {
            _factory = factory;
        }
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var client = _factory.CreateClient("PublicityHubApi");

            var users = await client.GetFromJsonAsync<List<UserViewModel>>(
                "/api/users"
            );

            return View(users);
        }
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateUserViewModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            var client = _factory.CreateClient("PublicityHubApi");

            var response = await client.PostAsJsonAsync("/api/Users", model);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                ModelState.AddModelError("", error);
                return View(model);
            }

            TempData["Success"] = "✅ User created successfully";

            return RedirectToAction("Create");
        }
    }
}
