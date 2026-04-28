using PublicityHub.Application.DTOs.JobAssignments;

public interface IJobAssignmentService
{
    Task<JobAssignmentDto> AssignAsync(CreateJobAssignmentDto dto);
    Task<JobAssignmentDto> AcceptAsync(int jobId);
    Task<JobAssignmentDto> CompleteAsync(int jobId);
    Task<JobAssignmentDto> RejectAsync(int jobId);
    Task<List<JobAssignmentDto>> GetByWorkerAsync(int workerId);
    Task<List<JobAssignmentDto>> GetByCampaignAsync(int campaignId);
}
