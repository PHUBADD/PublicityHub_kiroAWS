using System.Net.Http.Headers;
using System.Text.Json;

namespace PublicityHub.Admin.Services
{
    public class ApiClient
    {
        private readonly IHttpClientFactory _factory;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private static readonly JsonSerializerOptions _json = new() { PropertyNameCaseInsensitive = true };

        public ApiClient(IHttpClientFactory factory, IHttpContextAccessor httpContextAccessor)
        {
            _factory = factory;
            _httpContextAccessor = httpContextAccessor;
        }

        private HttpClient CreateAuthorizedClient()
        {
            var client = _factory.CreateClient("PublicityHubApi");
            var token = _httpContextAccessor.HttpContext?.Session.GetString("token");
            if (!string.IsNullOrEmpty(token))
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            return client;
        }

        public async Task<T?> GetAsync<T>(string path)
        {
            var client = CreateAuthorizedClient();
            var response = await client.GetAsync(path);
            if (!response.IsSuccessStatusCode) return default;
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<T>(json, _json);
        }

        public async Task<HttpResponseMessage> PostAsync<T>(string path, T body)
        {
            var client = CreateAuthorizedClient();
            return await client.PostAsJsonAsync(path, body);
        }
    }
}
