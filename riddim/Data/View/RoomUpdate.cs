using System;
using System.Collections.Generic;

namespace Riddim.Data.View
{
    public record RoomUpdate
    {
        public string Name { get; init; }
        public string Slug { get; init; }
        public string Description { get; init; }
        public IEnumerable<object> Sources { get; init; }
        public Uri ImageUrl { get; init; }
    }
}
