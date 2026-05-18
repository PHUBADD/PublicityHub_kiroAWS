using PublicityHub.Application.DTOs.Campaigns;
using PublicityHub.Application.DTOs.Proofs;
using PublicityHub.Application.Guards;
using PublicityHub.Application.Services;
using PublicityHub.Domain.Enums;
using PublicityHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
public class CampaignService : ICampaignService
{
    private readonly AppDbContext _context;

    public CampaignService(AppDbContext context)
    {
        _context = context;
    }

    // =====================================================
    // READ OPERATIONS (NO STATE CHANGE)
    // =====================================================

    /// <summary>
    /// Returns all campaigns for Admin dashboard listing.
    /// 
    /// Purpose:
    /// - Used by Admin UI to show campaign cards
    /// - Read-only operation
    /// - Does NOT modify campaign state
    /// - Does NOT apply guards
    ///
    /// Data returned:
    /// - Basic campaign details
    /// - Current lifecycle status (as enum)
    /// </summary>
    public async Task<List<CampaignDto>> GetAllAsync()
    {
        var campaigns = await _context.Campaigns
            .Include(c => c.CreatedByUser)
            .Include(c => c.JobAssignments)
            .ToListAsync();

        return campaigns.Select(c => new CampaignDto
        {
            Id = c.Id,
            Title = c.Title,
            Amount = c.Amount,
            CreatedByName = c.CreatedByUser.FullName,
            Status = c.Status,
            AssignedCount = c.JobAssignments.Count
        }).ToList();
    }
    public async Task<List<CampaignDto>> GetAllAsyncuser(int? userId = null)
{
    var query = _context.Campaigns
        .Include(c => c.CreatedByUser)
        .Include(c => c.JobAssignments)
        .AsQueryable();

    // ✅ FILTER ONLY FOR PROVIDER
    if (userId.HasValue)
    {
        query = query.Where(c => c.CreatedBy == userId.Value);
    }

    var campaigns = await query.ToListAsync();

    return campaigns.Select(c => new CampaignDto
    {
        Id = c.Id,
        Title = c.Title,
        Amount = c.Amount,
        CreatedByName = c.CreatedByUser.FullName,
        Status = c.Status,
        AssignedCount = c.JobAssignments.Count
    }).ToList();
}

    /// <summary>
    /// Creates a new campaign.
    ///
    /// Purpose:
    /// - Called when Admin creates a campaign
    /// - Campaign is always created in Draft state
    /// - Lifecycle transitions happen later via guards
    ///
    /// Business Rules:
    /// - Creator must exist
    /// - Initial status is always Draft
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

    // =====================================================
    // REPORTING / DASHBOARD INSIGHTS
    // =====================================================

    /// <summary>
    /// Returns proof statistics grouped by campaign.
    ///
    /// Purpose:
    /// - Used by Admin dashboard analytics
    /// - Shows total proofs and pending proofs per campaign
    /// - Pure reporting method
    ///
    /// Important:
    /// - No lifecycle changes
    /// - No guards required
    /// </summary>
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

    /// <summary>
    /// Returns all proofs belonging to a specific campaign.
    ///
    /// Purpose:
    /// - Used by Admin to review proofs
    /// - Enables approve/reject workflows
    ///
    /// Notes:
    /// - Read-only operation
    /// - No campaign or assignment state is changed here
    /// </summary>
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

    // =====================================================
    // INTERNAL STATUS TRANSITION (GUARDED)
    // =====================================================

    /// <summary>
    /// Centralized internal method for changing campaign status.
    ///
    /// Purpose:
    /// - Ensures all lifecycle transitions pass through guard
    /// - Prevents illegal jumps (e.g., Draft → Completed)
    ///
    /// Rule:
    /// - Must NEVER be called directly by Controller
    /// - Can only be used by controlled service methods
    /// </summary>
    private void ChangeStatus(Campaign campaign, CampaignStatus newStatus)
    {
        if (!CampaignStatusGuard.CanTransition(campaign.Status, newStatus))
        {
            throw new InvalidOperationException(
                $"Invalid campaign transition: {campaign.Status} → {newStatus}");
        }

        campaign.Status = newStatus;
    }

    // =====================================================
    // CAMPAIGN LIFECYCLE ACTIONS (ADMIN ONLY)
    // =====================================================

    /// <summary>
    /// Publishes a campaign.
    ///
    /// Business Meaning:
    /// - Campaign is approved and visible for execution
    /// - Assignments can now be created
    ///
    /// Allowed Transition:
    /// Draft → Published
    /// </summary>
    public async Task PublishAsync(int campaignId)
    {
        var campaign = await _context.Campaigns.FindAsync(campaignId)
            ?? throw new Exception("Campaign not found");

        ChangeStatus(campaign, CampaignStatus.Published);
        campaign.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Starts campaign execution.
    ///
    /// Business Meaning:
    /// - Campaign moves into active execution phase
    /// - Workers are now performing tasks
    ///
    /// Preconditions:
    /// - At least one assignment must exist
    ///
    /// Allowed Transition:
    /// Published → InExecution
    /// </summary>
    public async Task StartExecutionAsync(int campaignId)
    {
        var campaign = await _context.Campaigns
            .Include(c => c.JobAssignments)
            .FirstAsync(c => c.Id == campaignId);

        if (!campaign.JobAssignments.Any())
            throw new InvalidOperationException(
                "Cannot start execution without assignments");

        ChangeStatus(campaign, CampaignStatus.InExecution);
        campaign.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Completes a campaign.
    ///
    /// Business Meaning:
    /// - All work has been performed
    /// - Proofs reviewed and approved
    ///
    /// Allowed Transition:
    /// InExecution → Completed
    /// </summary>
    public async Task CompleteAsync(int campaignId)
    {
        var campaign = await _context.Campaigns.FindAsync(campaignId)
            ?? throw new Exception("Campaign not found");

        //  LEVEL 3.5 RULE
        if (!await CanCompleteCampaignAsync(campaignId))
            throw new InvalidOperationException(
                "Cannot complete campaign with pending assignments");

        ChangeStatus(campaign, CampaignStatus.Completed);
        campaign.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Closes a campaign with audit information.
    /// Purpose:
    /// - Terminates campaign early or permanently
    /// - Records who closed it and why (audit trail)
    /// Allowed transitions:
    /// Draft → Closed
    /// Published → Closed
    /// </summary>
    public async Task CloseAsync(int campaignId, int closedBy, string? reason)
    {
        var campaign = await _context.Campaigns.FindAsync(campaignId)
            ?? throw new Exception("Campaign not found");

        ChangeStatus(campaign, CampaignStatus.Closed);

        campaign.ClosedBy = closedBy;
        campaign.ClosedReason = reason;
        campaign.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    // =====================================================
    // ASSIGNMENT AWARENESS (CAMPAIGN HEALTH)
    // =====================================================

    /// <summary>
    /// Determines whether a campaign can be safely completed.
    ///
    /// Business Rule:
    /// - A campaign can be completed ONLY IF
    ///   all assignments are in Approved state
    ///
    /// Used by:
    /// - Validation before campaign completion
    /// - Admin decision support
    /// </summary>
    public async Task<bool> CanCompleteCampaignAsync(int campaignId)
    {
        return !await _context.JobAssignments
            .AnyAsync(j =>
                j.CampaignId == campaignId &&
                j.Status != AssignmentStatus.Approved);
    }
}