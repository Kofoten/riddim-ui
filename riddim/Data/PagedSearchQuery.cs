namespace Riddim.Data
{
    public class PagedSearchQuery
    {
        public int Page { get; init; } = 0;
        public int PageSize { get; init; } = 20;
        public string Search { get; init; } = null;
    }
}
