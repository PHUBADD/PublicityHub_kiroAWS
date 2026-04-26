using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PublicityHub.Application.DTOs.Proofs
{
    public class ProofDto
    {
        public int Id { get; set; }
        public int AssignmentId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
