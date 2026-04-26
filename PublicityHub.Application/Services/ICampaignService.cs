using PublicityHub.Application.DTOs.Campaigns;

namespace PublicityHub.Application.Services;

public interface ICampaignService
{
    Task<List<CampaignDto>> GetAllAsync();
    Task<CampaignDto> CreateAsync(CreateCampaignDto dto);
}