using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PublicityHub.Application.DTOs.Users;
using PublicityHub.Application.Services;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _service;

    public UsersController(IUserService service)
    {
        _service = service;
    }
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _service.GetAllAsync();
        return Ok(users);
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
    {
        var result = await _service.CreateAsync(dto);

        return Ok(result);
    }

    //[HttpPost("login")]
    //public async Task<IActionResult> Login(LoginDto dto)
    //{
    //    var token = await _service.LoginAsync(dto);

    //    return Ok(new
    //    {
    //        token = token
    //    });
    //}
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        try
        {
            var result = await _service.LoginWithUserAsync(dto);

            return Ok(result);
        }
        catch
        {
            return NotFound();
        }
    }


    [HttpGet("me")]
    public IActionResult Me()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

        return Ok(new { userId, role });
    }

}