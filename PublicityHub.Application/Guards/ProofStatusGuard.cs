using PublicityHub.Domain.Enums;
namespace PublicityHub.Application.Guards
{
    public static class ProofStatusGuard
    {
        public static bool CanTransition(
            ProofStatus from,
            ProofStatus to)
        {
            return from switch
            {
                ProofStatus.Uploaded =>
                    to == ProofStatus.UnderReview,

                ProofStatus.UnderReview =>
                    to == ProofStatus.Approved ||
                    to == ProofStatus.Rejected,

                _ => false
            };
        }
    }
}