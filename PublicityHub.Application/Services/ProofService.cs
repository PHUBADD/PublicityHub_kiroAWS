using Microsoft.EntityFrameworkCore;
using PublicityHub.Application.DTOs.Proofs;
using PublicityHub.Application.Guards;
using PublicityHub.Domain.Entities;
using PublicityHub.Infrastructure.Data;
using PublicityHub.Domain.Enums;
using Microsoft.EntityFrameworkCore;
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
    // Purpose:
    // Worker/Admin uploads proof.
    // Immediately moves to UnderReview.
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


    /// <summary>
    /// Admin approves a proof.
    /// Business Meaning:
    /// - Proof is valid
    /// - Assignment is approved
    /// </summary>
    public async Task ApproveAsync(int proofId)
    {
        var proof = await _context.Proofs
            .Include(p => p.JobAssignment)
            .ThenInclude(a => a.Campaign)
            .FirstOrDefaultAsync(p => p.Id == proofId)
            ?? throw new Exception("Proof not found");

        // ✅ Approve proof
        proof.Status = ProofStatus.Approved;
        proof.ReviewedAt = DateTime.UtcNow;

        // ✅ Approve assignment
        proof.JobAssignment.Status = AssignmentStatus.Approved;

        await _context.SaveChangesAsync();

        // ✅ Auto-complete campaign if all assignments approved
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
    /// Business Meaning:
    /// - Proof is invalid
    /// - Assignment must be reassigned
    /// </summary>
    public async Task RejectAsync(int proofId)
    {
        var proof = await _context.Proofs
            .Include(p => p.JobAssignment)
            .FirstOrDefaultAsync(p => p.Id == proofId)
            ?? throw new Exception("Proof not found");

        // Reject proof
        proof.Status = ProofStatus.Rejected;

        // ✅ Force assignment reset
        var assignment = proof.JobAssignment;
        assignment.Status = AssignmentStatus.Accepted;

        _context.JobAssignments.Update(assignment);   // ✅ THIS IS THE KEY LINE

        await _context.SaveChangesAsync();
    }



    // =========================
    // READ-ONLY: GET BY ASSIGNMENT
    // =========================
    // Purpose:
    // Used to check if proof exists for assignment.
    public async Task<ProofDto?> GetByAssignmentAsync(int assignmentId)
    {
        var proof = await _context.Proofs
            .FirstOrDefaultAsync(x => x.AssignmentId == assignmentId);

        return proof == null ? null : Map(proof);
    }

    // =========================
    // INTERNAL GUARDED TRANSITION
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

    private static ProofDto Map(Proof p) =>
        new()
        {
            Id = p.Id,
            AssignmentId = p.AssignmentId,
            ImageUrl = p.ImageUrl,
            Status = p.Status.ToString()
        };
}