using PublicityHub.Domain.Enums;

namespace PublicityHub.Application.DTOs.Campaigns;

public class CampaignDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string CreatedByName { get; set; } = string.Empty;
    public int AssignedCount { get; set; }
    public CampaignStatus Status { get; set; }

}