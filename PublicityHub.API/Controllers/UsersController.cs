using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PublicityHub.Application.DTOs.Users;
using PublicityHub.Application.Services;
using PublicityHub.Domain.Entities;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{

    private readonly IUserService _service;
    private readonly IJwtService _jwtService;


    public UsersController(IUserService service, IJwtService jwtService)
    {
        _service = service;
        _jwtService = jwtService;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _service.GetAllAsync();
        return Ok(users);
    }
    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> CreateUser(CreateUserDto dto)
    {
        try
        {
            var user = await _service.CreateAsync(dto);  // ✅ CORRECT CALL

            return Ok(new
            {
                message = "User created successfully",
                user
            });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
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
            var user = await _service.LoginWithUserAsync(dto);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid phone number" });
            }

            var token = _jwtService.GenerateToken(
                user.User.Id,
                user.User.Role
            );

            user.Token = token;

            return Ok(user);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error" });
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