using Microsoft.Extensions.Options;
using Riddim.Data.Transfer;
using Riddim.Services.Options;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace Riddim.Services
{
    public class RoomGeneratorService
    {
        private readonly ConcurrentDictionary<Guid, RoomSettings> cache;
        private readonly ConcurrentDictionary<string, Guid> slugLookup;

        public RoomGeneratorService(IOptions<RoomGeneratorServiceOptions> options)
        {
            cache = new ConcurrentDictionary<Guid, RoomSettings>();
            slugLookup = new ConcurrentDictionary<string, Guid>();
            Generate(options.Value.Count);
        }

        private void Generate(int count)
        {
            for (int i = 0; i < count; i++)
            {
                var value = cache.AddOrUpdate(Guid.NewGuid(), (id) => new RoomSettings
                {
                    Id = id,
                    Name = id.ToString()[24..],
                    Slug = id.ToString()[24..],
                    Description = $"Room {id}",
                    ImageUrl = new Uri("https://rasmussteen.com/portrait.jpg")
                }, (id, item) => item);

                slugLookup.AddOrUpdate(value.Slug, value.Id, (key, _) => value.Id);
            }
        }

        public IEnumerable<RoomMetadata> GetList()
        {
            return cache.Values.Select(item => new RoomMetadata
            {
                Id = item.Id,
                Name = item.Name,
                Slug = item.Slug,
                Description = item.Description,
                ImageUrl = item.ImageUrl
            });
        }

        public bool TryGet(Guid id, out RoomSettings room)
        {
            return cache.TryGetValue(id, out room);
        }

        public bool TryGetBySlug(string slug, out RoomSettings room)
        {
            room = default;
            return slugLookup.TryGetValue(slug, out var id) && cache.TryGetValue(id, out room);
        }
    }
}
