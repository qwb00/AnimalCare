using Microsoft.Extensions.DependencyInjection;
using Models.Entities;

namespace Repositories.Configuration
{
    public static class ExaminationRecordsConfiguration
    {
        public static async Task SeedExaminationRecordsAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<RepositoryContext>();

            if (context.Requests != null && !context.Requests.Any())
            {
                context.Requests.AddRange(
                    new ExaminationRecord
                    {
                        Id = Guid.Parse("e8b8c6fa-9f45-4c61-8bf7-2e1a5d3c4f6a"),
                        AnimalId = Guid.Parse("5bc27217-6817-40e4-b8d1-60dc9aca3e83"), // Animal: Buddy
                        CareTakerId = Guid.Parse("e920f477-7f53-4bba-b1b6-d8d9376b4d30"), // CareTaker 1
                        VeterinarianId = Guid.Parse("c2ad823a-c3bc-49cb-a930-2fd719c0e997"), // Veterinarian 1
                        Text = "Initial health check.",
                        Status = "Completed",
                        Notes = "All vaccinations up to date.",
                        Date = DateTime.UtcNow.AddDays(-10),
                        CreatedAt = DateTime.UtcNow.AddDays(-10)
                    },
                    new ExaminationRecord
                    {
                        Id = Guid.Parse("f9c9d7fb-af56-4d72-9d08-3f2b6e4d5f7b"),
                        AnimalId = Guid.Parse("59fe555e-3bcc-4ace-b9fc-68b76805ac59"), // Animal: Whiskers
                        CareTakerId = Guid.Parse("e920f477-7f53-4bba-b1b6-d8d9376b4d30"), // CareTaker 1
                        VeterinarianId = Guid.Parse("ad2d34eb-d2a8-4e0a-9a17-c0d295d8995a"), // Veterinarian 2
                        Text = "Sterilization procedure.",
                        Status = "Completed",
                        Notes = "Recovery is going well.",
                        Date = DateTime.UtcNow.AddDays(-5),
                        CreatedAt = DateTime.UtcNow.AddDays(-5)
                    },
                    new ExaminationRecord
                    {
                        Id = Guid.Parse("0a0b0c0d-bf67-4e83-ae19-4f3c7f5e6e8c"),
                        AnimalId = Guid.Parse("b4e645e1-4a28-45a2-9aa3-3b76af8a5f12"), // Animal: Max
                        CareTakerId = Guid.Parse("e920f477-7f53-4bba-b1b6-d8d9376b4d30"), // CareTaker 1
                        VeterinarianId = Guid.Parse("c2ad823a-c3bc-49cb-a930-2fd719c0e997"), // Veterinarian 1
                        Text = "Treatment for illness.",
                        Status = "Ongoing",
                        Notes = "Requires daily medication.",
                        Date = DateTime.UtcNow.AddDays(-2),
                        CreatedAt = DateTime.UtcNow.AddDays(-2)
                    },
                    new ExaminationRecord
                    {
                        Id = Guid.Parse("1b1c1d1e-c078-4f94-bf2a-5e4d8f6f7d9d"),
                        AnimalId = Guid.Parse("af1e3bcd-7a21-4e3f-8f6a-7c5e2d1f0b9a"), // Animal: Luna
                        CareTakerId = Guid.Parse("e920f477-7f53-4bba-b1b6-d8d9376b4d30"), // CareTaker 1
                        VeterinarianId = Guid.Parse("ad2d34eb-d2a8-4e0a-9a17-c0d295d8995a"), // Veterinarian 2
                        Text = "Routine check-up.",
                        Status = "Scheduled",
                        Notes = "No known issues.",
                        Date = DateTime.UtcNow.AddDays(2),
                        CreatedAt = DateTime.UtcNow
                    }
                );
                await context.SaveChangesAsync();
            }
        }
    }
}
