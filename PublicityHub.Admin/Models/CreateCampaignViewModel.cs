public class CreateCampaignViewModel
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal Amount { get; set; }

    // TEMP: hardcoded admin
    public int CreatedBy { get; set; } = 1;
}
