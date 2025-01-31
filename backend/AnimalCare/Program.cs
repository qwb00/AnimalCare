using AnimalCare.Extensions;
using Microsoft.AspNetCore.Identity;
using Repositories;
using Microsoft.EntityFrameworkCore;
using Models.Entities;
using Repositories.Configuration;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Mvc;
using AnimalCare.Presentation.ActionFilters;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(config =>
{
    config.InputFormatters.Insert(0, GetJsonPatchInputFormatter());
});
// swagger 
builder.Services.AddEndpointsApiExplorer();
builder.Services.ConfigureSwagger();

//builder.Services.AddRazorPages();
builder.Services.ConfigureCors();
builder.Services.ConfigureIISIntegration();
builder.Services.ConfigureRepositoryManager();
builder.Services.ConfigureServiceManager();

var connectionString = Environment.GetEnvironmentVariable("AZURE_SQL_CONNECTION_STRING")
                              ?? builder.Configuration.GetConnectionString("sqlConnection");

builder.Services.ConfigureSqlContext(connectionString);
builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddAuthentication();
builder.Services.ConfigureIdentity();
builder.Services.ConfigureJWT(builder.Configuration);

builder.Services.AddScoped<ValidationFilterAttribute>();
var app = builder.Build();

app.ConfigureExceptionHandler();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var context = services.GetRequiredService<RepositoryContext>();
    var userManager = services.GetRequiredService<UserManager<User>>();
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();

    context.Database.Migrate();

    await UsersConfiguration.InitializeAsync(userManager, roleManager);
    await AnimalsConfiguration.SeedAnimalsAsync(context);
    await ReservationsConfiguration.SeedReservations(context);
    await ExaminationRecordsConfiguration.SeedExaminationRecordsAsync(context);
    await MedicationScheduleConfiguration.SeedMedicationSchedulesAsync(context);

}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}
else
{
    app.UseSwagger();
    app.UseSwaggerUI(s =>
    {
        s.SwaggerEndpoint("/swagger/v1/swagger.json", "Animal Care API v1");
    });
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

NewtonsoftJsonPatchInputFormatter GetJsonPatchInputFormatter() =>
    new ServiceCollection().AddLogging().AddMvc().AddNewtonsoftJson()
    .Services.BuildServiceProvider()
    .GetRequiredService<IOptions<MvcOptions>>().Value.InputFormatters
    .OfType<NewtonsoftJsonPatchInputFormatter>().First();
