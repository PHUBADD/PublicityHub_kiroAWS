using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PublicityHub.Application.DTOs.JobAssignments
{
    public class CreateJobAssignmentDto
    {
        public int CampaignId { get; set; }
        public int WorkerId { get; set; }
    }
}
