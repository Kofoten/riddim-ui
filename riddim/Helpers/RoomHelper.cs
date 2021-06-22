using Riddim.Data.Domain;
using Riddim.Data.View;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Riddim.Helpers
{
    public static class RoomHelper
    {
        public static readonly Expression<Func<Room, RoomView>> ToViewConverterExpression = (room) => new RoomView
        {
            Id = room.Id,
            Name = room.Name,
            Slug = room.Slugs.First(x => x.Primary).Slug,
            Description = room.Description,
            ImageUrl = room.ImageUrl
        };

        public static RoomView ToView(Room room, string slug = null)
        {
            return new RoomView
            {
                Id = room.Id,
                Name = room.Name,
                Slug = slug ?? room.Slugs.First(x => x.Primary).Slug,
                Description = room.Description,
                ImageUrl = room.ImageUrl
            };
        }
    }
}
