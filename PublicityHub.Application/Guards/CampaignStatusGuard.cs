using PublicityHub.Domain.Enums;
namespace PublicityHub.Application.Guards
{
    public static class CampaignStatusGuard
    {
        public static bool CanTransition(
            CampaignStatus from,
            CampaignStatus to)
        {
            return from switch
            {
                CampaignStatus.Draft =>
                    to == CampaignStatus.Published,

                CampaignStatus.Published =>
                    to == CampaignStatus.PartnerInProgress,

                CampaignStatus.PartnerInProgress =>
                    to == CampaignStatus.ReadyForAssignment,

                CampaignStatus.ReadyForAssignment =>
                    to == CampaignStatus.InExecution,

                CampaignStatus.InExecution =>
                    to == CampaignStatus.Completed,

                CampaignStatus.Completed =>
                    to == CampaignStatus.Closed,

                _ => false
            };
        }
    }
}