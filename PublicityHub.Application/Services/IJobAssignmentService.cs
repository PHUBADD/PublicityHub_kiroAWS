using PublicityHub.Application.DTOs.JobAssignments;

public interface IJobAssignmentService
{
    Task<JobAssignmentDto> AssignAsync(CreateJobAssignmentDto dto);
    Task<JobAssignmentDto> RejectAsync(int jobId);
    Task<List<JobAssignmentDto>> GetByWorkerAsync(int workerId);
    Task<List<JobAssignmentDto>> GetByCampaignAsync(int campaignId);

    //  Workflow actions (no return value)
    Task AcceptAsync(int assignmentId);
    Task CompleteAsync(int assignmentId);

}
