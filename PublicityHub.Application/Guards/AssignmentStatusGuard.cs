using PublicityHub.Domain.Enums;
namespace PublicityHub.Application.Guards
{
    public static class AssignmentStatusGuard
    {
        public static bool CanTransition(
            AssignmentStatus from,
            AssignmentStatus to)
        {
            return from switch
            {
                AssignmentStatus.Created =>
                    to == AssignmentStatus.Available,

                AssignmentStatus.Available =>
                    to == AssignmentStatus.Accepted,

                AssignmentStatus.Accepted =>
                    to == AssignmentStatus.InProgress,

                AssignmentStatus.InProgress =>
                    to == AssignmentStatus.ProofSubmitted,

                AssignmentStatus.ProofSubmitted =>
                    to == AssignmentStatus.Approved ||
                    to == AssignmentStatus.Rejected,

                AssignmentStatus.Rejected =>
                    to == AssignmentStatus.Reassigned,

                AssignmentStatus.Reassigned =>
                    to == AssignmentStatus.Available,

                _ => false
            };
        }
    }
}