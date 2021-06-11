using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Riddim.Data.Domain.Configuration
{
    public class RoomConfiguration : IEntityTypeConfiguration<Room>
    {
        public void Configure(EntityTypeBuilder<Room> builder)
        {
            builder
                .Property(x => x.Id)
                .IsRequired()
                .HasColumnName("id");

            builder
                .Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(64)
                .HasColumnName("name");

            builder
                .Property(x => x.Description)
                .HasMaxLength(256)
                .HasColumnName("description");

            builder
                .Property(x => x.ImageUrl)
                .HasMaxLength(128)
                .HasColumnName("image_url");

            builder
                .HasKey(x => x.Id)
                .HasName("pk_room");

            builder
                .HasIndex(x => x.Name)
                .IsUnique()
                .HasDatabaseName("uq_room_name");

            builder
                .ToTable("rooms");
        }
    }
}
