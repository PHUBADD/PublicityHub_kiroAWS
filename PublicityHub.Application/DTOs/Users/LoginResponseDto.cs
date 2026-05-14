using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PublicityHub.Application.DTOs.Users
{
    public class LoginResponseDto
    {
        public string Token { get; set; }
        public UserDto User { get; set; }

        public string PhoneNumber { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;

    }
}
