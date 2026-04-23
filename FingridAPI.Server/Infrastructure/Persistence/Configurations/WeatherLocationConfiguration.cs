using FingridAPI.Server.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FingridAPI.Server.Infrastructure.Persistence.Configurations;

public sealed class WeatherLocationConfiguration
    : IEntityTypeConfiguration<WeatherLocation>
{
    public void Configure(EntityTypeBuilder<WeatherLocation> builder)
    {
        builder.ToTable("weather_locations");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
               .IsRequired();

        builder.HasIndex(x => x.Name)
               .HasDatabaseName("ix_weather_locations_name");

        builder.Property(x => x.CreatedAt)
               .HasDefaultValueSql("now()");
    }
}