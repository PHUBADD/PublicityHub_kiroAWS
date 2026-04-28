using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

public class AdminAuthorizeAttribute : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        var httpContext = context.HttpContext;

        var token = httpContext.Session.GetString("JWT");
        if (string.IsNullOrEmpty(token))
        {
            context.Result = new RedirectToActionResult(
                "Login", "Account", null);
            return;
        }

        var role = JwtHelper.GetRole(token);

        if (role != "admin")
        {
            context.Result = new RedirectToActionResult(
                "AccessDenied", "Account", null);
            return;
        }

        base.OnActionExecuting(context);
    }
}