using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Riddim.Data;
using Riddim.Data.Transfer;
using Riddim.Services;
using System.Linq;
using System.Threading.Tasks;

namespace Riddim.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly RiddimDbContext context;
        private readonly ILogger logger;

        public RoomController(RiddimDbContext context, ILogger<RoomController> logger)
        {
            this.context = context;
            this.logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<PageResult<RoomMetadata>>> List([FromQuery] PagedSearchQuery query)
        {
            var rooms = await context.Rooms
                .Where(x => x.Name.Contains(query.Search))
                .OrderBy(x => x.Id)
                .Skip(query.Page * query.PageSize)
                .Take(query.PageSize + 1)
                .Select(x => new RoomMetadata
                {
                    Id = x.Id,
                    Name = x.Name,
                    Slug = x.Slugs.First(y => y.Primary).Slug,
                    Description = x.Description,
                    ImageUrl = x.ImageUrl
                })
                .ToListAsync();

            return Ok(new PageResult<RoomMetadata>()
            {
                Page = query.Page,
                PageSize = query.PageSize,
                HasMore = rooms.Count > query.PageSize,
                Items = rooms.Take(query.PageSize)
            });
        }

        [HttpGet]
        [Route("{slug}")]
        public async Task<ActionResult<RoomSettings>> Get([FromRoute] string slug)
        {
            var room = await context.RoomSlugs
                .Where(x => x.Slug == slug)
                .Select(x => new RoomSettings
                {
                    Id = x.Room.Id,
                    Name = x.Room.Name,
                    Slug = x.Room.Slugs.First(y => y.Primary).Slug,
                    Description = x.Room.Description,
                    ImageUrl = x.Room.ImageUrl
                })
                .FirstOrDefaultAsync();

            if (room is null)
            {
                return NotFound();
            }

            return Ok(room);
        }
    }
}
