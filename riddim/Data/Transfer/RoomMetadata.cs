using System;

namespace Riddim.Data.Transfer
{
    public record RoomMetadata
    {
        public Guid Id { get; init; }
        public string Name { get; init; }
        public string Slug { get; init; }
        public string Description { get; set; }
        public Uri ImageUrl { get; init; }
    }
}
