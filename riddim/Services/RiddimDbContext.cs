using Microsoft.EntityFrameworkCore;
using Riddim.Data.Domain;
using System.Reflection;

namespace Riddim.Services
{
    public class RiddimDbContext : DbContext 
    {
        public RiddimDbContext(DbContextOptions<RiddimDbContext> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetAssembly(typeof(RiddimDbContext)));
        }

        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomSlug> RoomSlugs { get; set; }
    }
}
