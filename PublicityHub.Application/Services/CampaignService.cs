using Microsoft.EntityFrameworkCore;
using PublicityHub.Infrastructure.Data;
using PublicityHub.Domain.Entities;
using PublicityHub.Application.DTOs.Campaigns;

namespace PublicityHub.Application.Services;

public class CampaignService : ICampaignService
{
    private readonly AppDbContext _context;

    public CampaignService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CampaignDto>> GetAllAsync()
    {
        var campaigns = await _context.Campaigns
            .Include(c => c.CreatedByUser)
            .ToListAsync();

        if (campaigns.Count == 0)
            throw new Exception("No campaigns found");

        return campaigns.Select(c => new CampaignDto
        {
            Id = c.Id,
            Title = c.Title,
            Amount = c.Amount,
            CreatedByName = c.CreatedByUser?.FullName ?? string.Empty
        }).ToList();
    }

    public async Task<CampaignDto> CreateAsync(CreateCampaignDto dto)
    {
        //  Validate provider exists
        var user = await _context.Users.FindAsync(dto.CreatedBy);

        if (user == null)
            throw new Exception("Invalid provider. User not found");

        //  Create campaign
        var campaign = new Campaign
        {
            Title = dto.Title,
            Description = dto.Description,
            Location = dto.Location,
            Amount = dto.Amount,
            CreatedBy = dto.CreatedBy,
            CreatedAt = DateTime.UtcNow
        };

        _context.Campaigns.Add(campaign);
        await _context.SaveChangesAsync();

        return new CampaignDto
        {
            Id = campaign.Id,
            Title = campaign.Title,
            Amount = campaign.Amount,
            CreatedByName = user.FullName
        };
    }
}