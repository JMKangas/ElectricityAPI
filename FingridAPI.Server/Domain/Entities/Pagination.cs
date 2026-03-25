namespace FingridAPI.Server.Domain.Entities
{

    public sealed class Pagination
    {
        public int Total { get; set; }
        public int LastPage { get; set; }
        public int? NextPage { get; set; }
        public int? PrevPage { get; set; }
        public int CurrentPage { get; set; }
        public int PerPage { get; set; }
        public int From { get; set; }
        public int To { get; set; }
    }

}
