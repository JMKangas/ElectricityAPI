namespace FingridAPI.Server.Domain.Entities
{
    public sealed class DatasetMetadata
    {
        public int Id { get; set; }
        public DateTime ModifiedAtUtc { get; set; }
        public string Type { get; set; }
        public string Status { get; set; }
        public string Organization { get; set; }
        public string NameFi { get; set; }
        public string NameEn { get; set; }
        public string DescriptionFi { get; set; }
        public string DescriptionEn { get; set; }
        public string DataPeriodFi { get; set; }
        public string DataPeriodEn { get; set; }
        public string UnitFi { get; set; }
        public string UnitEn { get; set; }
        public string[] KeyWordsFi { get; set; }
        public string[] KeyWordsEn { get; set; }
    }

}
