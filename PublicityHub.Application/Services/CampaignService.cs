using PublicityHub.Application.DTOs.Campaigns;
using PublicityHub.Application.DTOs.Proofs;
using PublicityHub.Application.Guards;
using PublicityHub.Application.Services;
using PublicityHub.Domain.Entities;
using PublicityHub.Infrastructure.Data;
using PublicityHub.Domain.Enums;
using Microsoft.EntityFrameworkCore;
public class CampaignService : ICampaignService
{
    private readonly AppDbContext _context;

    public CampaignService(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Returns all campaigns for admin overview.
    /// Read‑only method: no state mutation, no guards required.
    /// </summary>
    public async Task<List<CampaignDto>> GetAllAsync()
    {
        var campaigns = await _context.Campaigns
            .Include(c => c.CreatedByUser)
            .ToListAsync();


        return campaigns.Select(c => new CampaignDto
        {
            Id = c.Id,
            Title = c.Title,
            Amount = c.Amount,
            CreatedByName = c.CreatedByUser.FullName,
            Status = c.Status
        }).ToList();

    }

    /// <summary>
    /// Creates a new campaign.
    /// Initial status is always Draft.
    /// Status transitions are enforced later via guards.
    /// </summary>
    public async Task<CampaignDto> CreateAsync(CreateCampaignDto dto)
    {
        var user = await _context.Users.FindAsync(dto.CreatedBy)
            ?? throw new Exception("User not found");

        var campaign = new Campaign
        {
            Title = dto.Title,
            Description = dto.Description,
            Location = dto.Location,
            Amount = dto.Amount,
            CreatedBy = dto.CreatedBy,
            CreatedAt = DateTime.UtcNow,
            Status = CampaignStatus.Draft
        };

        _context.Campaigns.Add(campaign);
        await _context.SaveChangesAsync();

        return new CampaignDto
        {
            Id = campaign.Id,
            Title = campaign.Title,
            Amount = campaign.Amount,
            CreatedByName = user.FullName
        };
    }

    // ================================
    // ADMIN OVERVIEW – PROOF COUNTS
    // ================================
    // Purpose:
    // Used by Admin dashboards to show how many proofs are
    // pending/completed per campaign.
    // This is reporting logic only – no status updates here.
    public async Task<List<CampaignProofCountDto>> GetProofCountsAsync()
    {
        return await (
            from proof in _context.Proofs
            join assignment in _context.JobAssignments
                on proof.AssignmentId equals assignment.Id
            group proof by assignment.CampaignId into g
            select new CampaignProofCountDto
            {
                CampaignId = g.Key,
                TotalProofs = g.Count(),
                PendingProofs = g.Count(p => p.Status == ProofStatus.UnderReview)
            }
        ).ToListAsync();
    }

    // ================================
    // ADMIN – VIEW ALL PROOFS BY CAMPAIGN
    // ================================
    // Purpose:
    // Allows Admin to review proofs belonging to a campaign.
    // Read‑only operation – no guards required.
    public async Task<List<ProofDto>> GetProofsByCampaignAsync(int campaignId)
    {
        return await (
            from proof in _context.Proofs
            join assignment in _context.JobAssignments
                on proof.AssignmentId equals assignment.Id
            where assignment.CampaignId == campaignId
            select new ProofDto
            {
                Id = proof.Id,
                AssignmentId = proof.AssignmentId,
                ImageUrl = proof.ImageUrl,
                Status = proof.Status.ToString()
            }
        ).ToListAsync();
    }

    // ================================
    // INTERNAL STATUS CHANGE (GUARDED)
    // ================================
    // Purpose:
    // Centralizes campaign lifecycle transitions.
    // Prevents illegal jumps like Draft → Completed.
    private void ChangeStatus(Campaign campaign, CampaignStatus newStatus)
    {
        if (!CampaignStatusGuard.CanTransition(campaign.Status, newStatus))
        {
            throw new InvalidOperationException(
                $"Invalid campaign transition: {campaign.Status} → {newStatus}");
        }

        campaign.Status = newStatus;
    }

    public async Task PublishAsync(int campaignId)
    {
        var campaign = await _context.Campaigns.FindAsync(campaignId)
            ?? throw new Exception("Campaign not found");

        ChangeStatus(campaign, CampaignStatus.Published);

        campaign.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task StartExecutionAsync(int campaignId)
    {
        var campaign = await _context.Campaigns.FindAsync(campaignId)
            ?? throw new Exception("Campaign not found");

        ChangeStatus(campaign, CampaignStatus.InExecution);

        campaign.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task CompleteAsync(int campaignId)
    {
        var campaign = await _context.Campaigns.FindAsync(campaignId)
            ?? throw new Exception("Campaign not found");

        ChangeStatus(campaign, CampaignStatus.Completed);

        campaign.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task CloseAsync(int campaignId)
    {
        var campaign = await _context.Campaigns.FindAsync(campaignId)
            ?? throw new Exception("Campaign not found");

        ChangeStatus(campaign, CampaignStatus.Closed);

        campaign.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

}
