namespace PublicityHub.Application.DTOs.Campaigns;

public class CreateCampaignDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Location { get; set; }
    public decimal Amount { get; set; }
    public int CreatedBy { get; set; }
}