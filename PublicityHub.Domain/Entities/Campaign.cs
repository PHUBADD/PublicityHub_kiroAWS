namespace PublicityHub.Domain.Entities;

public class Campaign
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? Location { get; set; }

    public decimal Amount { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public User? CreatedByUser { get; set; }

    public ICollection<JobAssignment> JobAssignments { get; set; } = new List<JobAssignment>();
}