using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Riddim.Data.Domain.Configuration
{
    public class RoomSlugConfiguration : IEntityTypeConfiguration<RoomSlug>
    {
        public void Configure(EntityTypeBuilder<RoomSlug> builder)
        {
            builder
                .Property(x => x.Id)
                .IsRequired()
                .HasColumnName("id");

            builder
                .Property(x => x.RoomId)
                .IsRequired()
                .HasColumnName("room_id");

            builder
                .Property(x => x.Primary)
                .IsRequired()
                .HasColumnName("primary");

            builder
                .Property(x => x.Slug)
                .IsRequired()
                .HasMaxLength(64)
                .HasColumnName("slug");

            builder
                .Property(x => x.AddedAt)
                .IsRequired()
                .HasColumnName("added_at");

            builder
                .HasKey(x => x.Id)
                .HasName("pk_roomslug");

            builder
                .HasOne(x => x.Room)
                .WithMany(x => x.Slugs)
                .HasForeignKey(x => x.RoomId)
                .HasConstraintName("fk_roomslug_room_id");

            builder
                .HasIndex(x => x.Slug)
                .IsUnique()
                .HasDatabaseName("uq_roomslug_slug");

            builder
                .ToTable("roomslugs");
        }
    }
}
