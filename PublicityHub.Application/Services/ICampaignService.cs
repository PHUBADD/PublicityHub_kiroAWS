using PublicityHub.Application.DTOs.Campaigns;
using PublicityHub.Application.DTOs.Proofs;

public interface ICampaignService
{
    Task<List<CampaignDto>> GetAllAsync();
    Task<CampaignDto> CreateAsync(CreateCampaignDto dto);
    Task<List<CampaignProofCountDto>> GetProofCountsAsync();
    Task<List<ProofDto>> GetProofsByCampaignAsync(int campaignId);

    // Campaign lifecycle
    Task PublishAsync(int campaignId);
    Task StartExecutionAsync(int campaignId);
    Task CompleteAsync(int campaignId);

    //  Audit-aware close
    Task CloseAsync(int campaignId, int closedBy, string? reason);

    // Campaign health
    Task<bool> CanCompleteCampaignAsync(int campaignId);
}