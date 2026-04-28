using Microsoft.AspNetCore.Mvc;
using PublicityHub.Application.DTOs.Proofs;
using PublicityHub.Application.Services;

[ApiController]
[Route("api/[controller]")]
public class ProofsController : ControllerBase
{
    private readonly IProofService _service;

    public ProofsController(IProofService service)
    {
        _service = service;
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
}
