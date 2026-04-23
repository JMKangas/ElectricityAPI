using FingridAPI.Server.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Data;

namespace FingridAPI.Server.Infrastructure.Persistence.Configurations
{

    public sealed class DatasetConfiguration : IEntityTypeConfiguration<DatasetMetadata>
    {
        public void Configure(EntityTypeBuilder<DatasetMetadata> builder)
        {
            builder.ToTable("datasets");
            builder.HasKey(x => x.Id);
        }
    }

}
