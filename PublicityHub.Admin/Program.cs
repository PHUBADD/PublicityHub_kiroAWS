var builder = WebApplication.CreateBuilder(args);

// MVC
builder.Services.AddControllersWithViews();

// Session (JWT storage)
builder.Services.AddSession(options =>
{
    // Keep session alive
    options.IdleTimeout = TimeSpan.FromHours(6);

    //  Security
    options.Cookie.HttpOnly = true;

    //  Required for HTTPS (Render)
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;

    //  Prevent login issues across domains
    options.Cookie.SameSite = SameSiteMode.Lax;

    options.Cookie.IsEssential = true;
});


// HttpClient for API
builder.Services.AddHttpClient("PublicityHubApi", client =>
{
    client.BaseAddress = new Uri(
        builder.Configuration["ApiSettings:BaseUrl"]
    );
});

//  REGISTER ADMIN AUTH SERVICE (FIX)
builder.Services.AddScoped<AdminAuthService>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseSession();
app.UseCookiePolicy();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Login}/{id?}");

app.Run();
