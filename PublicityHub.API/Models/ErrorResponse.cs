namespace PublicityHub.API.Models
{
    public class ErrorResponse
    {
        public bool Success { get; set; } = false;
        public string Message { get; set; }
        public string ErrorCode { get; set; }
    }
}