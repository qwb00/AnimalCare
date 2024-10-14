using Contracts;
using Service;
using Service.Contracts;
using Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Models.Entities;

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

        public static void ConfigureIdentity(this IServiceCollection services)
        {
            var builder = services.AddIdentityCore<User>(o =>
            {
                o.Password.RequireDigit = true;
                o.Password.RequireLowercase = true;
                o.Password.RequireUppercase = true;
                o.Password.RequireNonAlphanumeric = false;
                o.Password.RequiredLength = 10;
                o.User.RequireUniqueEmail = true;
            })
                .AddEntityFrameworkStores<RepositoryContext>()
                .AddDefaultTokenProviders();
        }

    }
}
