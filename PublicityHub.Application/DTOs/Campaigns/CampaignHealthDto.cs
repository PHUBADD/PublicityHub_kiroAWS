using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PublicityHub.Application.DTOs.Campaigns
{
    public class CampaignHealthDto
    {
        public int CampaignId { get; set; }
        public int TotalAssignments { get; set; }
        public int ProofsSubmitted { get; set; }
        public int ApprovedProofs { get; set; }
        public int RejectedProofs { get; set; }
    }
}
