namespace FingridAPI.Server.API.DTOs
{
    public sealed class SpotPriceDto
    {
        public double Value { get; set; }

        // Fingrid uses snake_case → JSON attributes needed
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }

}
