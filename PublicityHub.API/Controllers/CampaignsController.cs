using Microsoft.AspNetCore.Mvc;
using PublicityHub.Application.Services;
using PublicityHub.Application.DTOs.Campaigns;

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
    public async Task<IActionResult> Get()
    {
        var data = await _service.GetAllAsync();
        return Ok(data);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCampaignDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return Ok(result);
    }
}