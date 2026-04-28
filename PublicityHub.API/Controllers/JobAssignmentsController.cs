using Microsoft.AspNetCore.Mvc;
using PublicityHub.Application.DTOs.JobAssignments;

[ApiController]
[Route("api/[controller]")]
public class JobAssignmentsController : ControllerBase
{
    private readonly IJobAssignmentService _service;

    public JobAssignmentsController(IJobAssignmentService service)
    {
        _service = service;
    }

    [HttpPost("assign")]
    public async Task<IActionResult> Assign(CreateJobAssignmentDto dto)
    {
        var result = await _service.AssignAsync(dto);
        return Ok(result);
    }

    [HttpPost("{id}/accept")]
    public async Task<IActionResult> Accept(int id)
    {
        var result = await _service.AcceptAsync(id);
        return Ok(result);
    }

    [HttpPost("{id}/complete")]
    public async Task<IActionResult> Complete(int id)
    {
        var result = await _service.CompleteAsync(id);
        return Ok(result);
    }

    [HttpPost("{id}/reject")]
    public async Task<IActionResult> Reject(int id)
    {
        var result = await _service.RejectAsync(id);
        return Ok(result);
    }

    [HttpGet("worker/{workerId}")]
    public async Task<IActionResult> GetByWorker(int workerId)
    {
        var data = await _service.GetByWorkerAsync(workerId);
        return Ok(data);
    }
}
