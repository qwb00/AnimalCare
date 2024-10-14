using Contracts;
using Service;
using Service.Contracts;
using Repositories;
using Microsoft.EntityFrameworkCore;

namespace AnimalCare.Extensions
{
    public static class ServiceExtensions
    {
        // CORS cross-origin resource sharing

        // AllowAnyOrigin -> WithOrigins("example.com")
        // AllowAnyMethod -> WithMethods("POST", "GET")
        // AllowAnyHeader -> WithHeaders("accept", "content-type")
        public static void ConfigureCors(this IServiceCollection services) =>
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", builder =>
                builder.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .WithExposedHeaders("X-Pagination"));
            });

        public static void ConfigureRepositoryManager(this IServiceCollection services) =>
            services.AddScoped<IRepositoryManager, RepositoryManager>();

        public static void ConfigureServiceManager(this IServiceCollection services) =>
            services.AddScoped<IServiceManager, ServiceManager>();

        public static void ConfigureSqlContext(this IServiceCollection services, IConfiguration configuration) =>
            services.AddDbContextPool<RepositoryContext>(
                options => options.UseSqlServer(configuration.GetConnectionString("sqlConnection"),
                sqlOptions => sqlOptions.EnableRetryOnFailure()));

    }
}
