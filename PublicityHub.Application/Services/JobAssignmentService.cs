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
        // ✅ CHECK: already assigned or active
        var exists = await _context.JobAssignments
            .AnyAsync(x => x.CampaignId == dto.CampaignId
                && x.Status != AssignmentStatus.Rejected);

        if (exists)
        {
            throw new Exception("Worker already assigned to this campaign or work in progress");
        }

        var assignment = new JobAssignment
        {
            CampaignId = dto.CampaignId,
            WorkerId = dto.WorkerId,
            Status = AssignmentStatus.Available   // ✅ initial state
        };

        _context.JobAssignments.Add(assignment);
        await _context.SaveChangesAsync();

        return Map(assignment);
    }


    // =========================
    // WORKER ACCEPTS JOB
    // =========================
    /// <summary>
    /// Worker accepts an available assignment.
    /// Allowed: Available → Accepted
    /// </summary>
    public async Task AcceptAsync(int assignmentId)
    {
        var assignment = await _context.JobAssignments.FindAsync(assignmentId)
            ?? throw new Exception("Assignment not found");

        //  Guard enforced here
        ChangeStatus(assignment, AssignmentStatus.Accepted);

        assignment.AcceptedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Worker completes assigned work.
    /// Allowed: Accepted → InProgress → ProofSubmitted
    /// </summary>
    public async Task CompleteAsync(int assignmentId)
    {
        var assignment = await _context.JobAssignments.FindAsync(assignmentId)
            ?? throw new Exception("Assignment not found");

        ChangeStatus(assignment, AssignmentStatus.ProofSubmitted);

        assignment.CompletedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
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
        var jobs = await _context.JobAssignments.Include(x => x.Campaign).Where(x => x.WorkerId == workerId).ToListAsync();

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
            AssignmentId = j.Id,
            CampaignId = j.CampaignId,
            WorkerId = j.WorkerId,
            Status = j.Status.ToString(),
            CampaignTitle = j.Campaign?.Title,
            Amount = j.Campaign?.Amount ?? 0,
            Location = j.Campaign?.Location

        };
}
