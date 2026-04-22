using FingridAPI.Server.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FingridAPI.Server.Infrastructure.Persistence
{
    public static class FinnishCitySeeder
    {
        public static async Task SeedAsync(FingridContext db)
        {
            if (await db.WeatherLocations.AnyAsync())
                return;

            var lines = await File.ReadAllLinesAsync("FI.txt");

            var cities = new List<WeatherLocation>();

            foreach (var line in lines)
            {
                var p = line.Split('\t');

                cities.Add(new WeatherLocation
                {
                    Id = Guid.NewGuid(),
                    Name = p[1],
                    Latitude = double.Parse(p[4]),
                    Longitude = double.Parse(p[5]),
                    CountryCode = "FI",
                    CreatedAt = DateTimeOffset.UtcNow
                });
            }

            db.WeatherLocations.AddRange(cities);
            await db.SaveChangesAsync();
        }
    }
}
