using System.IdentityModel.Tokens.Jwt;

public static class JwtHelper
{
    public static string? GetRole(string token)
    {
        var handler = new JwtSecurityTokenHandler();

        var jwt = handler.ReadJwtToken(token);
        return jwt.Claims
                  .FirstOrDefault(c => c.Type == "role")
                  ?.Value;
    }

    public static string? GetUserId(string token)
    {
        var handler = new JwtSecurityTokenHandler();

        var jwt = handler.ReadJwtToken(token);
        return jwt.Claims
                  .FirstOrDefault(c => c.Type.Contains("nameidentifier"))
                  ?.Value;
    }
}
