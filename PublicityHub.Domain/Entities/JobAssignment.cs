using PublicityHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

public class JobAssignment
{
    public int Id { get; set; }

    public int CampaignId { get; set; }

    public int WorkerId { get; set; }

    public string Status { get; set; } = "accepted";

    public DateTime AcceptedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    // Navigation
    public Campaign? Campaign { get; set; }

    public User? Worker { get; set; }

    public Proof? Proof { get; set; }
}
