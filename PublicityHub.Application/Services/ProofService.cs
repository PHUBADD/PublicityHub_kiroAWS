using Microsoft.EntityFrameworkCore;
using PublicityHub.Application.DTOs.Proofs;
using PublicityHub.Domain.Entities;
using PublicityHub.Infrastructure.Data;
using Microsoft.AspNetCore.Http;

public class ProofService : IProofService
{
    private readonly AppDbContext _context;

    public ProofService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ProofDto> UploadAsync(CreateProofDto dto)
    {
        var proof = new Proof
        {
            AssignmentId = dto.AssignmentId,
            ImageUrl = dto.ImageUrl,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            Status = "pending",
            UploadedAt = DateTime.UtcNow
        };

        _context.Proofs.Add(proof);
        await _context.SaveChangesAsync();

        return new ProofDto
        {
            Id = proof.Id,
            AssignmentId = proof.AssignmentId,
            ImageUrl = proof.ImageUrl,
            Status = proof.Status
        };
    }

    public async Task<ProofDto> ApproveAsync(int id)
    {
        var proof = await _context.Proofs.FindAsync(id);
        if (proof == null) throw new Exception("Proof not found");

        proof.Status = "approved";
        proof.ReviewedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new ProofDto
        {
            Id = proof.Id,
            AssignmentId = proof.AssignmentId,
            ImageUrl = proof.ImageUrl,
            Status = proof.Status
        };
    }

    public async Task<ProofDto> RejectAsync(int id)
    {
        var proof = await _context.Proofs.FindAsync(id);
        if (proof == null) throw new Exception("Proof not found");

        proof.Status = "rejected";
        proof.ReviewedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new ProofDto
        {
            Id = proof.Id,
            AssignmentId = proof.AssignmentId,
            ImageUrl = proof.ImageUrl,
            Status = proof.Status
        };
    }

    public async Task<ProofDto?> GetByAssignmentAsync(int assignmentId)
    {
        var proof = await _context.Proofs
            .FirstOrDefaultAsync(x => x.AssignmentId == assignmentId);

        if (proof == null) return null;

        return new ProofDto
        {
            Id = proof.Id,
            AssignmentId = proof.AssignmentId,
            ImageUrl = proof.ImageUrl,
            Status = proof.Status
        };
    }
}
