using System.Net.Http.Headers;

/// <summary>
/// Helper to create an HttpClient with the session JWT token attached.
/// Fixes the "401 Unauthorized" issue when Admin MVC calls protected API endpoints.
/// </summary>
public static class AuthenticatedHttpClient
{
    public static HttpClient Create(IHttpClientFactory factory, HttpContext httpContext, string clientName = "PublicityHubApi")
    {
        var client = factory.CreateClient(clientName);

        var token = httpContext.Session.GetString("token");
        if (!string.IsNullOrEmpty(token))
        {
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);
        }

        return client;
    }
}
