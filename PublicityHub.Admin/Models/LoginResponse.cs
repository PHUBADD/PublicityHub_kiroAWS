namespace PublicityHub.Admin.Models
{
    public class LoginResponse
    {
        public string Token { get; set; }
        public UserViewModel User { get; set; }
    }
}
