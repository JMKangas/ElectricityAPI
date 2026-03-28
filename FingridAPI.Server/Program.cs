using FingridAPI.Server.API.Endpoints;
using FingridAPI.Server.Application.Services;
using FingridAPI.Server.Infrastructure.External;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddProblemDetails();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

//builder.Services.AddHttpClient<FingridApiClient>("fingrid", client =>
//{
//    client.BaseAddress = new Uri("https://data.fingrid.fi/api/");
//    client.DefaultRequestHeaders.Add("x-api-key", builder.Configuration["FingridApi:ApiKey"]);
//});

//API clients
builder.Services.AddHttpClient<FingridApiClient>(client =>
{
    client.BaseAddress = new Uri("https://data.fingrid.fi/api/");
    client.DefaultRequestHeaders.Add(
        "x-api-key",
        builder.Configuration["FingridApi:ApiKey"] 
    );
});

builder.Services.AddHttpClient<SpotPriceApiClient>(client =>
{
    client.BaseAddress = new Uri("https://www.sahkohinta-api.fi/api/vartti/v1/");
});
// REGISTER THE SERVICE (required)
builder.Services.AddScoped<FingridService>();
builder.Services.AddScoped<SpotPriceService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}


string[] summaries = ["Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"];

var api = app.MapGroup("/api");
api.MapGet("weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.MapDefaultEndpoints();

app.MapSpotPriceEndpoints();
app.MapDatasetEndpoints();

app.UseFileServer();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
