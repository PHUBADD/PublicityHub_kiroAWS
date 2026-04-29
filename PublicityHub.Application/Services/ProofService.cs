using Microsoft.EntityFrameworkCore;
using PublicityHub.Application.DTOs.Proofs;
using PublicityHub.Application.Guards;
using PublicityHub.Domain.Entities;
using PublicityHub.Infrastructure.Data;
using PublicityHub.Domain.Enums;
using Microsoft.EntityFrameworkCore;
public class ProofService : IProofService
{
    private readonly AppDbContext _context;

    public ProofService(AppDbContext context)
    {
        _context = context;
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

    // =========================
    // ADMIN APPROVE
    // =========================
    public async Task<ProofDto> ApproveAsync(int id)
    {
        var proof = await _context.Proofs.FindAsync(id)
            ?? throw new Exception("Proof not found");

        ChangeStatus(proof, ProofStatus.Approved);
        proof.ReviewedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Map(proof);
    }

    // =========================
    // ADMIN REJECT
    // =========================
    public async Task<ProofDto> RejectAsync(int id)
    {
        var proof = await _context.Proofs.FindAsync(id)
            ?? throw new Exception("Proof not found");

        ChangeStatus(proof, ProofStatus.Rejected);
        proof.ReviewedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Map(proof);
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
    private void ChangeStatus(Proof proof, ProofStatus newStatus)
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