using System.Text.Json.Serialization;
using Jobing.Api.Extensions;
using Jobing.Api.Middlewares;
using Jobing.Application;
using Jobing.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Layers
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// Identity, JWT, authorization policies, CORS, Swagger
builder.Services.AddIdentityServices();
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddAuthorizationBuilder().AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
builder.Services.AddAppCors();
builder.Services.AddSwaggerDocumentation();

// Controllers
builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// Exception handling
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

var app = builder.Build();

app.UseSwaggerDocumentation();
app.UseCors("AllowAll");
app.UseExceptionHandler();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

await app.SeedDatabaseAsync();

app.Run();
