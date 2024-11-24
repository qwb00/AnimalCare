using Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace AnimalCare.Factories
{
    public class RepositoryContextFactory : IDesignTimeDbContextFactory<RepositoryContext>
    {
        public RepositoryContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = Environment.GetEnvironmentVariable("AZURE_SQL_CONNECTION_STRING")
                              ?? configuration.GetConnectionString("sqlConnection");

            var builder = new DbContextOptionsBuilder<RepositoryContext>()
                .UseSqlServer(connectionString,
                b => b.MigrationsAssembly("AnimalCare"));

            return new RepositoryContext(builder.Options);
        }
    }
}
