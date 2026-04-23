using FingridAPI.Server.Domain.Entities;
using FingridAPI.Server.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FingridAPI.Server.Infrastructure.Repositories
{
    public class WeatherLocationRepository
    {
        private readonly FingridContext _db;

        public WeatherLocationRepository(FingridContext db)
        {
            _db = db;
        }

        public async Task<WeatherLocation?> FetchWeatherLocationAsync(Guid id, string city, CancellationToken ct)
        {
            return await _db.WeatherLocations.AsNoTracking().SingleOrDefaultAsync(wl => wl.Id == id && wl.Name == city, ct);
        }

        public async Task<List<WeatherLocation>> FetchAllAsync(CancellationToken ct)
        {
            return await _db.WeatherLocations.AsNoTracking().ToListAsync(ct);
        }
    }
}
