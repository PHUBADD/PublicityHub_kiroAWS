using PublicityHub.Domain.Enums;

public static class CampaignStatusGuard
{
    public static bool CanTransition(
        CampaignStatus from,
        CampaignStatus to)
    {
        return (from, to) switch
        {
            // Normal lifecycle
            (CampaignStatus.Draft, CampaignStatus.Published) => true,

            // Direct path when no partner/service order involved
            (CampaignStatus.Published, CampaignStatus.InExecution) => true,

            (CampaignStatus.Published, CampaignStatus.PartnerInProgress) => true,
            (CampaignStatus.PartnerInProgress, CampaignStatus.ReadyForAssignment) => true,
            (CampaignStatus.ReadyForAssignment, CampaignStatus.InExecution) => true,
            (CampaignStatus.InExecution, CampaignStatus.Completed) => true,

            // ✅ CLOSING RULES 
            (CampaignStatus.Draft, CampaignStatus.Closed) => true,
            (CampaignStatus.Published, CampaignStatus.Closed) => true,
            (CampaignStatus.PartnerInProgress, CampaignStatus.Closed) => true,
            (CampaignStatus.ReadyForAssignment, CampaignStatus.Closed) => true,
            (CampaignStatus.InExecution, CampaignStatus.Closed) => true,

            // Final close
            (CampaignStatus.Completed, CampaignStatus.Closed) => true,

            _ => false
        };
    }
}