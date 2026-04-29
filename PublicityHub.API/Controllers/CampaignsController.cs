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
    [HttpPost("{id}/publish")]
    public async Task<IActionResult> Publish(int id)
    {
        await _service.PublishAsync(id);
        return Ok();
    }

    [HttpPost("{id}/start")]
    public async Task<IActionResult> Start(int id)
    {
        await _service.StartExecutionAsync(id);
        return Ok();
    }

    [HttpPost("{id}/complete")]
    public async Task<IActionResult> Complete(int id)
    {
        await _service.CompleteAsync(id);
        return Ok();
    }

    [HttpPost("{id}/close")]
    public async Task<IActionResult> Close(int id)
    {
        await _service.CloseAsync(id);
        return Ok();
    }


}