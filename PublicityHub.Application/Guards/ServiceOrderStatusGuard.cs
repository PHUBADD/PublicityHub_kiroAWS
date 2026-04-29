using PublicityHub.Domain.Enums;
namespace PublicityHub.Application.Guards
{
    public static class ServiceOrderStatusGuard
    {
        public static bool CanTransition(
            ServiceOrderStatus from,
            ServiceOrderStatus to)
        {
            return from switch
            {
                ServiceOrderStatus.Requested =>
                    to == ServiceOrderStatus.Accepted,

                ServiceOrderStatus.Accepted =>
                    to == ServiceOrderStatus.InProduction,

                ServiceOrderStatus.InProduction =>
                    to == ServiceOrderStatus.Delivered,

                ServiceOrderStatus.Delivered =>
                    to == ServiceOrderStatus.Verified,

                _ => false
            };
        }
    }
}