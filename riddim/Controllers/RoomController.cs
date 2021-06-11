using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Riddim.Data;
using Riddim.Data.Transfer;
using Riddim.Services;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Riddim.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly RoomGeneratorService roomService;
        private readonly ILogger logger;

        public RoomController(ILogger<RoomController> logger, RoomGeneratorService roomService)
        {
            this.roomService = roomService;
            this.logger = logger;
        }

        [HttpGet]
        public ActionResult<PageResult<RoomMetadata>> List([FromQuery] PagedSearchQuery query)
        {
            var list = roomService
                .GetList()
                .Where(x => x.Name.Contains(query.Search, StringComparison.InvariantCultureIgnoreCase))
                .Skip(query.Page * query.PageSize)
                .Take(query.PageSize + 1)
                .ToList();

            return Ok(new PageResult<RoomMetadata>()
            {
                Page = query.Page,
                PageSize = query.PageSize,
                HasMore = list.Count > query.PageSize,
                Items = list.Take(query.PageSize)
            });
        }

        [HttpGet]
        [Route("{slug}")]
        public ActionResult<RoomSettings> Get([FromRoute] string slug)
        {
            if (roomService.TryGetBySlug(slug, out var room))
            {
                return Ok(room);
            }

            return NotFound();
        }
    }
}
