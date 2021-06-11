using System.Collections.Generic;

namespace Riddim.Data
{
    public class PageResult<T>
    {
        public int Page { get; init; }
        public int PageSize { get; init; }
        public bool HasMore { get; init; }
        public IEnumerable<T> Items { get; init; }
    }
}
