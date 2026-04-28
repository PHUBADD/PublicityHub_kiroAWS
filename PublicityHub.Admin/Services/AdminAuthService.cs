using System.Net.Http.Json;

public class AdminAuthService
{
    private readonly IHttpClientFactory _factory;

    public AdminAuthService(IHttpClientFactory factory)
    {
        _factory = factory;
    }

    public async Task<string?> LoginAsync(string phoneNumber)
    {
        var client = _factory.CreateClient("PublicityHubApi");

        var response = await client.PostAsJsonAsync("/api/users/login", new
        {
            PhoneNumber = phoneNumber
        });

        if (!response.IsSuccessStatusCode)
            return null;

        return await response.Content.ReadAsStringAsync();
    }
}