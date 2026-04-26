namespace PublicityHub.Domain.Entities;

public class User
{
    public int Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string? PasswordHash { get; set; }

    public string Role { get; set; } = string.Empty; // admin / worker / provider

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public ICollection<Campaign> Campaigns { get; set; } = new List<Campaign>();

    public ICollection<JobAssignment> JobAssignments { get; set; } = new List<JobAssignment>();
}