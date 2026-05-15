using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ===============================
//  MVC SUPPORT
// ===============================
builder.Services.AddControllersWithViews();


// ===============================
//  JWT AUTHENTICATION ( REQUIRED FIX)
// ===============================
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme) //  default scheme
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,          //  skip issuer validation (for dev)
            ValidateAudience = false,        //  skip audience validation
            ValidateLifetime = true,         //  check expiry
            ValidateIssuerSigningKey = true, //  validate token signature

            //  IMPORTANT: must match your API token key
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
            )
        };
    });


// ===============================
//  AUTHORIZATION SUPPORT
// ===============================
builder.Services.AddAuthorization();


// ===============================
//  SESSION CONFIGURATION
// ===============================
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromHours(6);
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.IsEssential = true;
});


// ===============================
//  HTTP CLIENT FOR API CALLS
// ===============================
builder.Services.AddHttpClient("PublicityHubApi", client =>
{
    client.BaseAddress = new Uri(
        builder.Configuration["ApiSettings:BaseUrl"]
    );
});


// ===============================
//  ADMIN AUTH SERVICE
// ===============================
builder.Services.AddScoped<AdminAuthService>();


var app = builder.Build();


// ===============================
//  ERROR HANDLING (PRODUCTION)
// ===============================
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}


// ===============================
//  MIDDLEWARE PIPELINE
// ===============================
app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

//  VERY IMPORTANT ORDER 
app.UseAuthentication();   //  Authenticate user
app.UseAuthorization();    //  Check roles & permissions

app.UseSession();
app.UseCookiePolicy();


// ===============================
//  ROUTING
// ===============================
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Login}/{id?}");

app.Run();
