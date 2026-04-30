using PublicityHub.Domain.Entities;
using PublicityHub.Domain.Enums;

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

    public User? CreatedByUser { get; set; }

    public CampaignStatus Status { get; set; }

    public ICollection<JobAssignment> JobAssignments { get; set; }
        = new List<JobAssignment>();
    //Audit
    public string? ClosedReason { get; set; }
    public int? ClosedBy { get; set; }
}