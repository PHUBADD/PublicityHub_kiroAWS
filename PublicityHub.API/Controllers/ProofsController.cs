using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PublicityHub.Application.DTOs.Proofs;
using PublicityHub.Application.Services;

[ApiController]
[Route("api/[controller]")]
public class ProofsController : ControllerBase
{
    private readonly IProofService _service;
    private readonly ICampaignService _campaignService;
    public ProofsController(IProofService service , ICampaignService campaignService)
    {
        _service = service;
        _campaignService = campaignService;
    }

    [HttpPost]
    public async Task<IActionResult> Upload([FromForm] CreateProofDto dto)
    {
        var result = await _service.UploadAsync(dto);
        return Ok(result);
    }


    [HttpPost("{id}/approve")]
    public async Task<IActionResult> Approve(int id)
    {
        var result = await _service.ApproveAsync(id);
        return Ok(result);
    }

    [HttpPost("{id}/reject")]
    public async Task<IActionResult> Reject(int id)
    {
        var result = await _service.RejectAsync(id);
        return Ok(result);
    }

    [HttpGet("assignment/{assignmentId}")]
    public async Task<IActionResult> GetByAssignment(int assignmentId)
    {
        var result = await _service.GetByAssignmentAsync(assignmentId);
        return Ok(result);
    }
    [HttpGet("campaign/{campaignId}")]
    public async Task<IActionResult> GetByCampaign(int campaignId)
    {
        var proofs = await _campaignService.GetProofsByCampaignAsync(campaignId);
        return Ok(proofs);
    }

}
