using PublicityHub.Domain.Entities;
using PublicityHub.Domain.Enums;

public class JobAssignment
{
    public int Id { get; set; }
    public int CampaignId { get; set; }
    public int WorkerId { get; set; }

    // ✅ THIS MUST BE ENUM
    public AssignmentStatus Status { get; set; }

    public DateTime? AcceptedAt { get; set; }
    public DateTime? CompletedAt { get; set; }

    public Campaign? Campaign { get; set; }
    public User? Worker { get; set; }
    public Proof? Proof { get; set; }
}
