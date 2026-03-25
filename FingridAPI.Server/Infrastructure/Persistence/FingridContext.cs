using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace FingridAPI.Server.Infrastructure.Persistence
{
    public class FingridContext(DbContextOptions<FingridContext> options)
        : DbContext(options)
    {
        //TODO
        //public DbSet<Item> Items => Set<Item>();

        //public DbSet<Category> Categories => Set<Category>();

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    modelBuilder.ApplyConfigurationsFromAssembly(typeof(ItemEntityConfiguration).Assembly);
        //}
    }

}
