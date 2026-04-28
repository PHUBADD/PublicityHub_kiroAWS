using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PublicityHub.Application.DTOs.Campaigns;
using PublicityHub.Application.Services;

namespace PublicityHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CampaignsController : ControllerBase
{
    private readonly ICampaignService _service;

    public CampaignsController(ICampaignService service)
    {
        _service = service;
    }

    [HttpGet]
    //[Authorize(Roles = "Customer")]
    public async Task<IActionResult> Get()
    {
        var data = await _service.GetAllAsync();
        return Ok(data);
    }

    [HttpPost]
    //[Authorize(Roles = "Customer")]
    public async Task<IActionResult> Create(CreateCampaignDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return Ok(result);
    }
    [HttpGet("proof-counts")]
    public async Task<IActionResult> GetProofCounts()
    {
        var counts = await _service.GetProofCountsAsync();
        return Ok(counts);
    }
    //joins JobAssignments + Proofs.
    [HttpGet("campaign/{campaignId}")]
    public async Task<IActionResult> GetProofsByCampaign(int campaignId)
    {
        var proofs = await _service.GetProofsByCampaignAsync(campaignId);
        return Ok(proofs);
    }

}