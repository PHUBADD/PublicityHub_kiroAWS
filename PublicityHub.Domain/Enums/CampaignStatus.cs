namespace PublicityHub.Domain.Enums
{
    public enum CampaignStatus
    {
        Draft,
        Published,
        PartnerInProgress,
        ReadyForAssignment,
        InExecution,
        Completed,
        Closed
    }

    public enum ServiceOrderStatus
    {
        Requested,
        Accepted,
        InProduction,
        Delivered,
        Verified
    }

    public enum AssignmentStatus
    {
        Created,
        Available,
        Accepted,
        InProgress,
        ProofSubmitted,
        Approved,
        Rejected,
        Reassigned
    }

    public enum ProofStatus
    {
        Uploaded,
        UnderReview,
        Approved,
        Rejected
    }
}