using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PublicityHub.Application.DTOs.Campaigns
{
    public class CampaignProofCountDto
    {
        public int CampaignId { get; set; }
        public int TotalProofs { get; set; }
        public int PendingProofs { get; set; }
    }
}
