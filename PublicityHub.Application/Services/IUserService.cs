using PublicityHub.Application.DTOs.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PublicityHub.Application.Services
{
    public interface IUserService
    {
        Task<List<UserDto>> GetAllAsync();
        Task<UserDto> CreateAsync(CreateUserDto dto);
        Task<string> LoginAsync(LoginDto dto);
        Task<LoginResponseDto> LoginWithUserAsync(LoginDto dto);
    }
}
