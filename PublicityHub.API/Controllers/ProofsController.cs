using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PublicityHub.Application.DTOs.Proofs;
using PublicityHub.Application.Services;

[ApiController]
[Route("api/[controller]")]
public class ProofsController : ControllerBase
{
    private readonly IProofService _service;
    private readonly ICampaignService _campaignService;

    public ProofsController(IProofService service, ICampaignService campaignService)
    {
        _service = service;
        _campaignService = campaignService;
    }

    // GET /api/Proofs — all proofs (admin)
    [HttpGet]
    [Authorize(Roles = "Admin,admin")]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();
        return Ok(result);
    }

    // POST /api/Proofs — upload proof (legacy)
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Upload([FromBody] CreateProofDto dto)
    {
        await _service.UploadAsync(dto);
        return Ok();
    }

    // POST /api/Proofs/submit — combined submit + mark assignment ProofSubmitted
    [HttpPost("submit")]
    [Authorize]
    public async Task<IActionResult> Submit([FromBody] CreateProofDto dto)
    {
        await _service.SubmitProofAsync(dto.AssignmentId, dto.ImageUrl, dto.Latitude, dto.Longitude);
        return Ok(new { message = "Proof submitted successfully" });
    }

    // POST /api/Proofs/{id}/approve
    [HttpPost("{id}/approve")]
    [Authorize(Roles = "Admin,admin")]
    public async Task<IActionResult> Approve(int id)
    {
        await _service.ApproveAsync(id);
        return Ok();
    }

    // POST /api/Proofs/{id}/reject
    [HttpPost("{id}/reject")]
    [Authorize(Roles = "Admin,admin")]
    public async Task<IActionResult> Reject(int id)
    {
        await _service.RejectAsync(id);
        return Ok();
    }

    // GET /api/Proofs/assignment/{assignmentId}
    [HttpGet("assignment/{assignmentId}")]
    [Authorize]
    public async Task<IActionResult> GetByAssignment(int assignmentId)
    {
        var result = await _service.GetByAssignmentAsync(assignmentId);
        return Ok(result);
    }

    // GET /api/Proofs/campaign/{campaignId}
    [HttpGet("campaign/{campaignId}")]
    [Authorize]
    public async Task<IActionResult> GetByCampaign(int campaignId)
    {
        var proofs = await _campaignService.GetProofsByCampaignAsync(campaignId);
        return Ok(proofs);
    }
}
