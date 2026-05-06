using PublicityHub.Domain.Enums;
namespace PublicityHub.Application.Guards
{
    public static class AssignmentStatusGuard
    {
        public static bool CanTransition(
            AssignmentStatus from,
            AssignmentStatus to)
        {
            return (from, to) switch
            {
                // Normal flow
                (AssignmentStatus.Available, AssignmentStatus.Accepted) => true,
                (AssignmentStatus.Accepted, AssignmentStatus.ProofSubmitted) => true,
                (AssignmentStatus.ProofSubmitted, AssignmentStatus.Approved) => true,

                // ✅ REJECT RETRY FLOW (THIS WAS MISSING)
                (AssignmentStatus.ProofSubmitted, AssignmentStatus.Accepted) => true,

                _ => false
            };
        }
    }
}