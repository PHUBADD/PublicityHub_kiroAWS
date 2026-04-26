using Microsoft.EntityFrameworkCore;
using PublicityHub.Application.DTOs.Users;
using PublicityHub.Application.Services;
using PublicityHub.Domain.Entities;
using PublicityHub.Infrastructure.Data;

public class UserService : IUserService
{
    private readonly AppDbContext _context;
    private readonly IJwtService _jwtService;

    public UserService(AppDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<List<UserDto>> GetAllAsync()
    {
        return await _context.Users
            .Select(u => new UserDto
            {
                Id = u.Id,
                FullName = u.FullName,
                PhoneNumber = u.PhoneNumber,
                Role = u.Role
            })
            .ToListAsync();
    }

    public async Task<UserDto> CreateAsync(CreateUserDto dto)
    {
        var allowedRoles = new[] { "admin", "worker", "provider" };

        var role = dto.Role?.ToLower();

        if (string.IsNullOrEmpty(role) || !allowedRoles.Contains(role))
        {
            role = "provider"; // default fallback
        }

        var user = new User
        {
            FullName = dto.FullName,
            PhoneNumber = dto.PhoneNumber,
            Role = role,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            PhoneNumber = user.PhoneNumber,
            Role = user.Role
        };
    }

    public async Task<string> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.PhoneNumber == dto.PhoneNumber);

        if (user == null)
            throw new Exception("User not found");

        return _jwtService.GenerateToken(user.Id, user.Role);
    }
}