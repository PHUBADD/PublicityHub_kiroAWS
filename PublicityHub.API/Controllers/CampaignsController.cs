using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PublicityHub.Application.DTOs.Campaigns;
using PublicityHub.Application.Services;
using PublicityHub.Domain.Enums;

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

    [HttpGet("all")]
    [Authorize]
    public async Task<IActionResult> Get()
    {
        var data = await _service.GetAllAsync();
        return Ok(data);
    }

    [HttpGet("by-user")]
    [Authorize]
    public async Task<IActionResult> Get([FromQuery] int? userId)
    {
        var data = await _service.GetAllAsyncuser(userId);
        return Ok(data);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreateCampaignDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return Ok(result);
    }

    [HttpGet("proof-counts")]
    [Authorize]
    public async Task<IActionResult> GetProofCounts()
    {
        var counts = await _service.GetProofCountsAsync();
        return Ok(counts);
    }

    [HttpGet("campaign/{campaignId}")]
    [Authorize]
    public async Task<IActionResult> GetProofsByCampaign(int campaignId)
    {
        var proofs = await _service.GetProofsByCampaignAsync(campaignId);
        return Ok(proofs);
    }

    [HttpPost("{id}/publish")]
    [Authorize(Roles = "Admin,admin")]
    public async Task<IActionResult> Publish(int id)
    {
        await _service.PublishAsync(id);
        return Ok();
    }

    [HttpPost("{id}/start")]
    [Authorize(Roles = "Admin,admin")]
    public async Task<IActionResult> Start(int id)
    {
        await _service.StartExecutionAsync(id);
        return Ok();
    }

    [HttpPost("{id}/complete")]
    [Authorize(Roles = "Admin,admin")]
    public async Task<IActionResult> Complete(int id)
    {
        await _service.CompleteAsync(id);
        return Ok();
    }

    [HttpPost("{id}/close")]
    [Authorize]
    public async Task<IActionResult> Close(int id, [FromBody] CloseCampaignDto dto)
    {
        await _service.CloseAsync(id, dto.ClosedBy, dto.Reason);
        return Ok();
    }

    [HttpGet("{id}/can-complete")]
    [Authorize]
    public async Task<IActionResult> CanComplete(int id)
    {
        var canComplete = await _service.CanCompleteCampaignAsync(id);
        return Ok(new { canComplete });
    }
}
