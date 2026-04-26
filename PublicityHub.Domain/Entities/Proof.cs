namespace PublicityHub.Domain.Entities;

public class Proof
{
    public int Id { get; set; }

    public int AssignmentId { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public decimal Latitude { get; set; }

    public decimal Longitude { get; set; }

    public string Status { get; set; } = "pending";

    public DateTime UploadedAt { get; set; }

    public DateTime? ReviewedAt { get; set; }

    // Navigation
    public JobAssignment? JobAssignment { get; set; }
}