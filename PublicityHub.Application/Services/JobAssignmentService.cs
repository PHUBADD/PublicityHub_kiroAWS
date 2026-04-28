using Microsoft.EntityFrameworkCore;
using PublicityHub.Application.DTOs.JobAssignments;
using PublicityHub.Domain.Entities;
using PublicityHub.Infrastructure.Data;

public class JobAssignmentService : IJobAssignmentService
{
    private readonly AppDbContext _context;

    public JobAssignmentService(AppDbContext context)
    {
        _context = context;
    }

    // =========================
    // ASSIGN JOB (User assigns to worker)
    // =========================
    public async Task<JobAssignmentDto> AssignAsync(CreateJobAssignmentDto dto)
    {
        //  Prevent duplicate assignment
        var exists = await _context.JobAssignments
            .AnyAsync(x => x.CampaignId == dto.CampaignId
                        && x.WorkerId == dto.WorkerId);

        if (exists)
        {
            return new JobAssignmentDto
            {
                Id = 0,
                CampaignId = dto.CampaignId,
                WorkerId = dto.WorkerId,
                Status = "already_assigned"
            };
            // use exception instead of response
            throw new Exception("Job already assigned to this worker");
        }

        var entity = new JobAssignment
        {
            CampaignId = dto.CampaignId,
            WorkerId = dto.WorkerId,
            Status = "pending"
        };

        _context.JobAssignments.Add(entity);
        await _context.SaveChangesAsync();

        return new JobAssignmentDto
        {
            Id = entity.Id,
            CampaignId = entity.CampaignId,
            WorkerId = entity.WorkerId,
            Status = entity.Status
        };
    }

    // =========================
    // WORKER ACCEPT JOB
    // =========================
    public async Task<JobAssignmentDto> AcceptAsync(int jobId)
    {
        var job = await _context.JobAssignments.FindAsync(jobId);
        if (job == null)
            throw new Exception("Job not found");

        if (job.Status != "pending")
            throw new Exception("Only pending jobs can be accepted");

        job.Status = "accepted";
        job.AcceptedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new JobAssignmentDto
        {
            Id = job.Id,
            CampaignId = job.CampaignId,
            WorkerId = job.WorkerId,
            Status = job.Status
        };
    }

    // =========================
    // WORKER COMPLETE JOB
    // =========================
    public async Task<JobAssignmentDto> CompleteAsync(int jobId)
    {
        var job = await _context.JobAssignments.FindAsync(jobId);
        if (job == null)
            throw new Exception("Job not found");

        if (job.Status != "accepted")
            throw new Exception("Only accepted jobs can be completed");

        job.Status = "completed";
        job.CompletedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new JobAssignmentDto
        {
            Id = job.Id,
            CampaignId = job.CampaignId,
            WorkerId = job.WorkerId,
            Status = job.Status
        };
    }

    // =========================
    // WORKER REJECT JOB
    // =========================
    public async Task<JobAssignmentDto> RejectAsync(int jobId)
    {
        var job = await _context.JobAssignments.FindAsync(jobId);
        if (job == null)
            throw new Exception("Job not found");

        if (job.Status != "pending")
            throw new Exception("Only pending jobs can be rejected");

        job.Status = "rejected";

        await _context.SaveChangesAsync();

        return new JobAssignmentDto
        {
            Id = job.Id,
            CampaignId = job.CampaignId,
            WorkerId = job.WorkerId,
            Status = job.Status
        };
    }

    // =========================
    // GET JOBS BY WORKER
    // =========================
    public async Task<List<JobAssignmentDto>> GetByWorkerAsync(int workerId)
    {
        return await _context.JobAssignments
            .Where(x => x.WorkerId == workerId)
            .Select(j => new JobAssignmentDto
            {
                Id = j.Id,
                CampaignId = j.CampaignId,
                WorkerId = j.WorkerId,
                Status = j.Status
            })
            .ToListAsync();
    }

    // =========================
    // GET JOBS BY CAMPAIGN
    // =========================
    public async Task<List<JobAssignmentDto>> GetByCampaignAsync(int campaignId)
    {
        return await _context.JobAssignments
            .Where(x => x.CampaignId == campaignId)
            .Select(j => new JobAssignmentDto
            {
                Id = j.Id,
                CampaignId = j.CampaignId,
                WorkerId = j.WorkerId,
                Status = j.Status
            })
            .ToListAsync();
    }
}