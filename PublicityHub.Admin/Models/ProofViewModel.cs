public class ProofViewModel
{
    public int Id { get; set; }
    public int AssignmentId { get; set; }
    public string ImageUrl { get; set; } = "";
    public string Status { get; set; } = "";
    public DateTime UploadedAt { get; set; }
}