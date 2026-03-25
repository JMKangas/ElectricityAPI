namespace FingridAPI.Server.Domain.Entities
{

    public sealed class DatasetData
    {
        public int DatasetId { get; set; }
        public DateTime StartTimeUtc { get; set; }
        public DateTime EndTimeUtc { get; set; }
        public List<DataPoint> Data { get; set; } = new();

        public Pagination? Pagination { get; set; }

    }

}
