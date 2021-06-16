﻿using EntityFramework.Exceptions.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Riddim.Data;
using Riddim.Data.Domain;
using Riddim.Data.Transfer;
using Riddim.Helpers;
using Riddim.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Riddim.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly RiddimDbContext context;

        public RoomController(RiddimDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<ActionResult<PageResult<RoomMetadata>>> List([FromQuery] PagedSearchQuery query)
        {
            var rooms = await context.Rooms
                .Where(x => string.IsNullOrEmpty(query.Search) || x.Name.Contains(query.Search))
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
        [Route("{key}")]
        public async Task<ActionResult<RoomView>> Get([FromRoute] string key, [FromQuery] string keyType)
        {
            if (string.IsNullOrEmpty(keyType))
            {
                keyType = "SLUG";
            }

            return keyType.ToUpper() switch
            {
                "SLUG" => await GetBySlug(key),
                "ID" => await GetById(key),
                _ => BadRequest(ErrorObject.InvalidKeyType),
            };
        }

        private async Task<ActionResult<RoomView>> GetById(string key)
        {
            if (!Guid.TryParse(key, out var id))
            {
                return BadRequest(ErrorObject.InvalidIdFormat);
            }

            var room = await context.Rooms
                .Include(x => x.Slugs)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (room is null)
            {
                return NotFound(ErrorObject.RoomNotFound);
            }

            return Ok(new RoomView
            {
                Id = room.Id,
                Name = room.Name,
                Slug = room.Slugs.First(x => x.Primary).Slug,
                Description = room.Description,
                ImageUrl = room.ImageUrl
            });
        }

        private async Task<ActionResult<RoomView>> GetBySlug(string slug)
        {
            var roomSlug = await context.RoomSlugs
                .Include(x => x.Room)
                .FirstOrDefaultAsync(x => x.Slug == slug);

            if (roomSlug is null)
            {
                return NotFound(ErrorObject.RoomNotFound);
            }

            return Ok(new RoomView
            {
                Id = roomSlug.Room.Id,
                Name = roomSlug.Room.Name,
                Slug = roomSlug.Slug,
                Description = roomSlug.Room.Description,
                ImageUrl = roomSlug.Room.ImageUrl
            });
        }

        [HttpPost]
        public async Task<ActionResult<RoomView>> Create([FromBody] RoomUpdate roomUpdate)
        {
            if (string.IsNullOrEmpty(roomUpdate.Name))
            {
                return BadRequest(ErrorObject.MissingRoomName);
            }

            if (string.IsNullOrEmpty(roomUpdate.Slug))
            {
                return BadRequest(ErrorObject.MissingRoomSlug);
            }

            if (!SlugHelper.ValidateSlug(roomUpdate.Slug))
            {
                return BadRequest(ErrorObject.InvalidRoomSlug);
            }

            var room = context.Rooms.Add(new Room
            {
                Name = roomUpdate.Name,
                Description = roomUpdate.Description,
                ImageUrl = roomUpdate.ImageUrl,
                Slugs = new HashSet<RoomSlug>
                {
                    new RoomSlug
                    {
                        Primary = true,
                        Slug = roomUpdate.Slug,
                        AddedAt = DateTimeOffset.UtcNow
                    }
                }
            });

            try
            {
                await context.SaveChangesAsync();
            }
            catch (UniqueConstraintException e)
            {
                return Conflict(CreateUniqueConstraintViolationErrorObject(e));
            }

            return Ok(new RoomView
            {
                Id = room.Entity.Id,
                Name = room.Entity.Name,
                Description = room.Entity.Description,
                ImageUrl = room.Entity.ImageUrl,
                Slug = room.Entity.Slugs.First(x => x.Primary).Slug
            });
        }

        [HttpPatch]
        [Route("{id}")]
        public async Task<ActionResult<RoomView>> Update([FromRoute] Guid id, [FromBody] RoomUpdate roomUpdate)
        {
            var room = await context.Rooms.FindAsync(id);
            if (room is null)
            {
                return NotFound(ErrorObject.RoomNotFound);
            }

            if (!string.IsNullOrEmpty(roomUpdate.Name))
            {
                room.Name = roomUpdate.Name;
            }

            if (!string.IsNullOrEmpty(roomUpdate.Slug))
            {
                if (!SlugHelper.ValidateSlug(roomUpdate.Slug))
                {
                    return BadRequest(ErrorObject.InvalidRoomSlug);
                }

                var primaryRoomSlugFound = false;
                var roomSlugs = await context.RoomSlugs.Where(x => x.RoomId == room.Id).ToListAsync();
                foreach (var roomSlug in roomSlugs)
                {
                    if (roomSlug.Slug == roomUpdate.Slug)
                    {
                        primaryRoomSlugFound = true;
                        if (!roomSlug.Primary)
                        {
                            roomSlug.Primary = true;
                        }
                    }
                    else if (roomSlug.Primary)
                    {
                        roomSlug.Primary = false;
                    }
                }

                if (!primaryRoomSlugFound)
                {
                    context.RoomSlugs.Add(new RoomSlug
                    {
                        Primary = true,
                        RoomId = room.Id,
                        Slug = roomUpdate.Slug,
                        AddedAt = DateTimeOffset.UtcNow
                    });
                    
                    if (roomSlugs.Count > 4)
                    {
                        context.RoomSlugs.RemoveRange(roomSlugs.OrderByDescending(x => x.AddedAt).Skip(4));
                    }
                }
            }

            if (roomUpdate.Description is object)
            {
                room.Description = roomUpdate.Description;
            }
            
            if (roomUpdate.ImageUrl is object)
            {
                room.ImageUrl = roomUpdate.ImageUrl;
            }

            try
            {
                await context.SaveChangesAsync();
            }
            catch (UniqueConstraintException e)
            {
                return Conflict(CreateUniqueConstraintViolationErrorObject(e));
            }

            return Ok(new RoomView
            {
                Id = room.Id,
                Name = room.Name,
                Description = room.Description,
                ImageUrl = room.ImageUrl,
                Slug = room.Slugs.First(x => x.Primary).Slug
            });
        }

        private ErrorObject CreateUniqueConstraintViolationErrorObject(UniqueConstraintException exception)
        {
            if (exception.InnerException is object)
            {
                return exception.InnerException switch
                {
                    PostgresException => (exception.InnerException as PostgresException).TableName switch
                    {
                        "rooms" => ErrorObject.UnavailableRoomName,
                        "roomslugs" => ErrorObject.UnavailableRoomSlug,
                        _ => ErrorObject.UnexpectedDatabaseConflict
                    },
                    _ => ErrorObject.UnexpectedDatabaseConflict
                };
            }

            return ErrorObject.UnexpectedDatabaseConflict;
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult<RoomView>> Delete([FromRoute] Guid id)
        {
            var room = await context.Rooms.FindAsync(id);
            if (room is null)
            {
                return NotFound(ErrorObject.RoomNotFound);
            }

            var roomSlugs = await context.RoomSlugs.Where(x => x.RoomId == room.Id).ToListAsync();
            context.RoomSlugs.RemoveRange(roomSlugs);
            context.Rooms.Remove(room);
            await context.SaveChangesAsync();
            return NoContent();
        }
    }
}
