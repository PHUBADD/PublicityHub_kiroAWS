using Microsoft.AspNetCore.Mvc;
using PublicityHub.Admin.Models;

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
            var client = _factory.CreateClient("PublicityHubApi");

            var response = await client.PostAsJsonAsync(
                "/api/users",
                model
            );

            if (!response.IsSuccessStatusCode)
            {
                ModelState.AddModelError("", "Failed to create user");
                return View(model);
            }

            return RedirectToAction("Index", "Dashboard");
        }
    }
}
