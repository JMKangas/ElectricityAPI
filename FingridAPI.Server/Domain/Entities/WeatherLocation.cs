using System.ComponentModel.DataAnnotations.Schema;

namespace FingridAPI.Server.Domain.Entities
{
    public class WeatherLocation
    {
        [Column("id")]
        public Guid Id { get; set; }

        [Column("name")]
        public string Name { get; set; } = null!;

        [Column("latitude")]
        public double Latitude { get; set; }

        [Column("longitude")]
        public double Longitude { get; set; }

        [Column("country_code")]
        public string? CountryCode { get; set; }

        [Column("created_at")]
        public DateTimeOffset CreatedAt { get; set; }
    }
}