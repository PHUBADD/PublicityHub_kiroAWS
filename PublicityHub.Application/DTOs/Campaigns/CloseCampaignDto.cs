using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PublicityHub.Application.DTOs.Campaigns
{
    public class CloseCampaignDto
    {
        public int ClosedBy { get; set; }
        public string? Reason { get; set; }
    }
}
