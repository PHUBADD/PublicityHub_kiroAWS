using Microsoft.EntityFrameworkCore;
using PublicityHub.Application.DTOs.Proofs;
using PublicityHub.Application.Guards;
using PublicityHub.Domain.Entities;
using PublicityHub.Infrastructure.Data;
using PublicityHub.Domain.Enums;

public class ProofService : IProofService
{
    private readonly ICampaignService _campaignService;
    private readonly AppDbContext _context;

    public ProofService(
        AppDbContext context,
        ICampaignService campaignService)
    {
        _context = context;
        _campaignService = campaignService;
    }

    // =========================
    // UPLOAD PROOF
    // =========================
    public async Task<ProofDto> UploadAsync(CreateProofDto dto)
    {
        var proof = new Proof
        {
            AssignmentId = dto.AssignmentId,
            ImageUrl = dto.ImageUrl,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            UploadedAt = DateTime.UtcNow,
            Status = ProofStatus.Uploaded
        };

        ChangeStatus(proof, ProofStatus.UnderReview);

        _context.Proofs.Add(proof);
        await _context.SaveChangesAsync();

        return Map(proof);
    }

    // =========================
    // GET ALL PROOFS
    // =========================
    public async Task<List<ProofDto>> GetAllAsync()
    {
        var proofs = await _context.Proofs.ToListAsync();
        return proofs.Select(Map).ToList();
    }

    // =========================
    // SUBMIT PROOF (combined: upload + set assignment ProofSubmitted)
    // =========================
    public async Task SubmitProofAsync(int assignmentId, string imageUrl, decimal? latitude, decimal? longitude)
    {
        var assignment = await _context.JobAssignments.FindAsync(assignmentId)
            ?? throw new Exception("Assignment not found");

        var existing = await _context.Proofs.FirstOrDefaultAsync(p => p.AssignmentId == assignmentId);
        if (existing != null)
            throw new InvalidOperationException("Proof already submitted for this assignment");

        var proof = new Proof
        {
            AssignmentId = assignmentId,
            ImageUrl = imageUrl,
            Latitude = latitude,
            Longitude = longitude,
            UploadedAt = DateTime.UtcNow,
            Status = ProofStatus.UnderReview
        };

        _context.Proofs.Add(proof);
        ChangeAssignmentStatus(assignment, AssignmentStatus.ProofSubmitted);
        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Admin approves a proof.
    /// </summary>
    public async Task ApproveAsync(int proofId)
    {
        var proof = await _context.Proofs
            .Include(p => p.JobAssignment)
            .ThenInclude(a => a.Campaign)
            .FirstOrDefaultAsync(p => p.Id == proofId)
            ?? throw new Exception("Proof not found");

        proof.Status = ProofStatus.Approved;
        proof.ReviewedAt = DateTime.UtcNow;
        proof.JobAssignment.Status = AssignmentStatus.Approved;

        await _context.SaveChangesAsync();

        var campaign = proof.JobAssignment.Campaign;
        if (await _campaignService.CanCompleteCampaignAsync(campaign.Id))
        {
            campaign.Status = CampaignStatus.Completed;
            campaign.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    /// <summary>
    /// Admin rejects a proof.
    /// </summary>
    public async Task RejectAsync(int proofId)
    {
        var proof = await _context.Proofs
            .Include(p => p.JobAssignment)
            .FirstOrDefaultAsync(p => p.Id == proofId)
            ?? throw new Exception("Proof not found");

        proof.Status = ProofStatus.Rejected;
        var assignment = proof.JobAssignment;
        assignment.Status = AssignmentStatus.Accepted;
        _context.JobAssignments.Update(assignment);

        await _context.SaveChangesAsync();
    }

    // =========================
    // GET BY ASSIGNMENT
    // =========================
    public async Task<ProofDto?> GetByAssignmentAsync(int assignmentId)
    {
        var proof = await _context.Proofs
            .FirstOrDefaultAsync(x => x.AssignmentId == assignmentId);

        return proof == null ? null : Map(proof);
    }

    // =========================
    // INTERNAL GUARDED TRANSITIONS
    // =========================
    public void ChangeStatus(Proof proof, ProofStatus newStatus)
    {
        if (!ProofStatusGuard.CanTransition(proof.Status, newStatus))
        {
            throw new InvalidOperationException(
                $"Invalid proof transition: {proof.Status} → {newStatus}");
        }
        proof.Status = newStatus;
    }

    private void ChangeAssignmentStatus(JobAssignment assignment, AssignmentStatus newStatus)
    {
        if (!AssignmentStatusGuard.CanTransition(assignment.Status, newStatus))
        {
            throw new InvalidOperationException(
                $"Invalid assignment transition: {assignment.Status} → {newStatus}");
        }
        assignment.Status = newStatus;
    }

    private static ProofDto Map(Proof p) =>
        new()
        {
            Id = p.Id,
            AssignmentId = p.AssignmentId,
            ImageUrl = p.ImageUrl,
            Status = p.Status.ToString()
        };
}
