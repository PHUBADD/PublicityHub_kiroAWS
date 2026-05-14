using Microsoft.IdentityModel.Tokens;
using PublicityHub.Application.DTOs.Users;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace PublicityHub.API.Helper
{
    public class helper
    {
        private string GenerateJwtToken(UserDto user)
        {
            var claims = new[]
            {
        new Claim(ClaimTypes.HomePhone, user.PhoneNumber),
        new Claim(ClaimTypes.Role, user.Role)
    };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("THIS_IS_MY_SECRET_KEY_12345"));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
      }
    }
}
