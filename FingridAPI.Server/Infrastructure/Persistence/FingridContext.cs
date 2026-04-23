using FingridAPI.Server.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FingridAPI.Server.Infrastructure.Persistence;

public class FingridContext : DbContext
{
    public FingridContext(DbContextOptions<FingridContext> options)
        : base(options) { }

    public DbSet<WeatherLocation> WeatherLocations => Set<WeatherLocation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(FingridContext).Assembly);
    }

}