namespace FingridAPI.Server.Domain.Entities;

public class SpotPrice
{
    public int Id { get; set; }  // Primary key for EF Core

    public double Value { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }
}