using Microsoft.AspNetCore.Http;

namespace PublicityHub.Application.DTOs.Proofs
{
    public class CreateProofDto
    {
        public int AssignmentId { get; set; }
        public string ImageUrl { get; set; } = string.Empty; 
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
    }
}
