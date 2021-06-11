using System;
using System.Collections.Generic;

namespace Riddim.Data.Domain
{
    public class Room
    {
        public Guid Id { get; set; }
        public string Name { get; init; }
        public string Description { get; set; }
        public Uri ImageUrl { get; set; }

        public ICollection<RoomSlug> Slugs { get; set; }

        public Room()
        {
            Slugs = new HashSet<RoomSlug>();
        }
    }
}
