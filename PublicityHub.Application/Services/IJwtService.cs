public interface IJwtService
{
    string GenerateToken(int userId, string role);
}