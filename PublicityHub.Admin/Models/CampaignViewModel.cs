public class CampaignViewModel
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string CreatedByName { get; set; } = string.Empty;
    public int CreatedBy { get; set; }
    public string Status { get; set; } = string.Empty;

    public int TotalProofs { get; set; }
    public int PendingProofs { get; set; }

    public int AssignedCount { get; set; }


}
