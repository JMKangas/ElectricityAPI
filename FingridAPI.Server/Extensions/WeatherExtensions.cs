using FingridAPI.Server.Application.Services;
using FingridAPI.Server.Infrastructure.External;

namespace FingridAPI.Server.Extensions
{

    public static class WeatherExtensions
    {
        public static IServiceCollection AddWeather(this IServiceCollection services)
        {
            services.AddHttpClient<WeatherApiClient>(); // ✅ gets default resilience
            services.AddScoped<WeatherService>();

            return services;
        }
    }

}
