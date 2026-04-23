using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace FingridAPI.Server.Infrastructure.Persistence
{
    public class FingridContextFactory : IDesignTimeDbContextFactory<FingridContext>
    {
        public FingridContext CreateDbContext(string[] args)
        {
            var connString = Environment.GetEnvironmentVariable("ConnectionStrings__appdb");

            if (string.IsNullOrWhiteSpace(connString))
            {
                throw new Exception("Missing ConnectionStrings__appdb environment variable.");
            }

            var options = new DbContextOptionsBuilder<FingridContext>()
                .UseNpgsql(connString)
                .Options;

            return new FingridContext(options);
        }

    }
}
