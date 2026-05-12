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
        await _service.AcceptAsync(id);
        return Ok(new { message = "Accepted successfully" });
    }

    [HttpPost("{id}/complete")]
    public async Task<IActionResult> Complete(int id)
    {
        await _service.CompleteAsync(id);
        return Ok();
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
    [HttpPost]
    public async Task<IActionResult> Create(CreateJobAssignmentDto dto)
    {

        try
        {
            var result = await _service.AssignAsync(dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.InnerException?.Message ?? ex.Message);
        }

    }

}
