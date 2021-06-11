using System;

namespace Riddim.Data.Domain
{
    public class RoomSlug
    {
        public Guid Id { get; set; }
        public Guid RoomId { get; set; }
        public bool Primary { get; set; }
        public string Slug { get; set; }

        public Room Room { get; set; }
    }
}
