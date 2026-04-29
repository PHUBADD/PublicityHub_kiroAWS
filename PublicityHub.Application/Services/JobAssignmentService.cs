using Microsoft.EntityFrameworkCore;
using PublicityHub.Application.DTOs.JobAssignments;
using PublicityHub.Application.Guards;
using PublicityHub.Domain.Entities;
using PublicityHub.Infrastructure.Data;
using PublicityHub.Domain.Enums;
public class JobAssignmentService : IJobAssignmentService
{
    private readonly AppDbContext _context;

    public JobAssignmentService(AppDbContext context)
    {
        _context = context;
    }

    // =========================
    // ASSIGN JOB (Admin / Owner)
    // =========================
    // Purpose:
    // Creates a new assignment and places it in Available state.
    // Guard ensures lifecycle integrity.
    public async Task<JobAssignmentDto> AssignAsync(CreateJobAssignmentDto dto)
    {
        var exists = await _context.JobAssignments
            .AnyAsync(x => x.CampaignId == dto.CampaignId &&
                           x.WorkerId == dto.WorkerId);

        if (exists)
            throw new Exception("Job already assigned to this worker");

        var entity = new JobAssignment
        {
            CampaignId = dto.CampaignId,
            WorkerId = dto.WorkerId,
            Status = AssignmentStatus.Created
        };

        ChangeStatus(entity, AssignmentStatus.Available);

        _context.JobAssignments.Add(entity);
        await _context.SaveChangesAsync();

        return Map(entity);
    }

    // =========================
    // WORKER ACCEPTS JOB
    // =========================
    public async Task<JobAssignmentDto> AcceptAsync(int jobId)
    {
        var job = await _context.JobAssignments.FindAsync(jobId)
            ?? throw new Exception("Job not found");

        ChangeStatus(job, AssignmentStatus.Accepted);
        job.AcceptedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Map(job);
    }

    // =========================
    // WORKER COMPLETES JOB
    // =========================
    public async Task<JobAssignmentDto> CompleteAsync(int jobId)
    {
        var job = await _context.JobAssignments.FindAsync(jobId)
            ?? throw new Exception("Job not found");

        ChangeStatus(job, AssignmentStatus.InProgress);
        ChangeStatus(job, AssignmentStatus.ProofSubmitted);

        await _context.SaveChangesAsync();
        return Map(job);
    }

    // =========================
    // WORKER / ADMIN REJECT
    // =========================
    public async Task<JobAssignmentDto> RejectAsync(int jobId)
    {
        var job = await _context.JobAssignments.FindAsync(jobId)
            ?? throw new Exception("Job not found");

        ChangeStatus(job, AssignmentStatus.Rejected);

        await _context.SaveChangesAsync();
        return Map(job);
    }

    // =========================
    // READ-ONLY: GET BY WORKER
    // =========================
    // Purpose:
    // Used by Worker or Admin dashboards.
    // No guard required (no state change).


    public async Task<List<JobAssignmentDto>> GetByWorkerAsync(int workerId)
    {
        var jobs = await _context.JobAssignments
            .Where(x => x.WorkerId == workerId)
            .ToListAsync();

        return jobs.Select(Map).ToList();
    }

    public async Task<List<JobAssignmentDto>> GetByCampaignAsync(int campaignId)
    {
        var jobs = await _context.JobAssignments
            .Where(x => x.CampaignId == campaignId)
            .ToListAsync();

        return jobs.Select(Map).ToList();
    }


    // =========================
    // INTERNAL STATUS TRANSITION
    // =========================
    // Centralized guard enforcement.
    private void ChangeStatus(JobAssignment job, AssignmentStatus newStatus)
    {
        if (!AssignmentStatusGuard.CanTransition(job.Status, newStatus))
        {
            throw new InvalidOperationException(
                $"Invalid assignment transition: {job.Status} → {newStatus}");
        }

        job.Status = newStatus;
    }

    // =========================
    // MAP DOMAIN → DTO
    // =========================
    private static JobAssignmentDto Map(JobAssignment j) =>
        new()
        {
            Id = j.Id,
            CampaignId = j.CampaignId,
            WorkerId = j.WorkerId,
            Status = j.Status
        };
}
