using PublicityHub.Domain.Enums;

namespace PublicityHub.Domain.Entities;

public class Proof
{
    public int Id { get; set; }

    public int AssignmentId { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public decimal Latitude { get; set; }

    public decimal Longitude { get; set; }


    public ProofStatus Status { get; set; }

    public DateTime UploadedAt { get; set; }

    public DateTime? ReviewedAt { get; set; }

    // Navigation
    public JobAssignment? JobAssignment { get; set; }
}