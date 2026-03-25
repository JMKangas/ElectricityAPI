namespace FingridAPI.Server.Domain.Entities
{

    public sealed class DataPoint
    {
        public int DatasetId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public double? Value { get; set; }
    }


}
