using Riddim.Data.Domain;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Riddim.Data.View
{
    public record RoomView
    {
        public Guid Id { get; init; }
        public string Name { get; init; }
        public string Slug { get; init; }
        public string Description { get; init; }
        public IEnumerable<object> Sources { get; init; }
        public Uri ImageUrl { get; init; }
    }
}
