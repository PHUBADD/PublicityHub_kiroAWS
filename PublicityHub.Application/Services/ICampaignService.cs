using PublicityHub.Application.DTOs.Campaigns;
using PublicityHub.Application.DTOs.Proofs;

namespace PublicityHub.Application.Services;

public interface ICampaignService
{
    Task<List<CampaignDto>> GetAllAsync();
    Task<CampaignDto> CreateAsync(CreateCampaignDto dto);
    Task<List<CampaignProofCountDto>> GetProofCountsAsync();
    Task<List<ProofDto>> GetProofsByCampaignAsync(int campaignId);

    Task PublishAsync(int campaignId);
    Task StartExecutionAsync(int campaignId);
    Task CompleteAsync(int campaignId);
    Task CloseAsync(int campaignId);


}