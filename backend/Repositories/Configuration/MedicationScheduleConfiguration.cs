using Microsoft.Extensions.DependencyInjection;
using Models.Entities;
using Shared.Enums;

namespace Repositories.Configuration
{
    public static class MedicationScheduleConfiguration
    {
        public static async Task SeedMedicationSchedulesAsync(RepositoryContext context)
        {
            if (context.Medications != null && !context.Medications.Any())
            {
                context.Medications.AddRange(
                    new MedicationSchedule
                    {
                        Id = Guid.NewGuid(),
                        Drug = "Amoxicillin",
                        Count = 2,
                        Unit = Unit.day,
                        Start = DateTime.UtcNow.AddDays(-10),
                        End = DateTime.UtcNow.AddDays(-5),
                        Description = "Antibiotic to treat bacterial infections.",
                        Diagnosis = "Bacterial skin infection.",
                        VeterinarianId = Guid.Parse("c2ad823a-c3bc-49cb-a930-2fd719c0e997"), // Veterinarian 1
                        AnimalId = Guid.Parse("5bc27217-6817-40e4-b8d1-60dc9aca3e83") // Bella
                    },
                    new MedicationSchedule
                    {
                        Id = Guid.NewGuid(),
                        Drug = "Prednisone",
                        Count = 3,
                        Unit = Unit.week,
                        Start = DateTime.UtcNow.AddDays(-20),
                        End = DateTime.UtcNow.AddDays(-10),
                        Description = "Steroid to reduce inflammation and suppress the immune system. Use after eating",
                        Diagnosis = "Allergic dermatitis.",
                        VeterinarianId = Guid.Parse("ad2d34eb-d2a8-4e0a-9a17-c0d295d8995a"), // Veterinarian 2
                        AnimalId = Guid.Parse("59fe555e-3bcc-4ace-b9fc-68b76805ac59") // Max
                    },
                    new MedicationSchedule
                    {
                        Id = Guid.NewGuid(),
                        Drug = "Metronidazole",
                        Count = 1,
                        Unit = Unit.week,
                        Start = DateTime.UtcNow.AddDays(-15),
                        End = DateTime.UtcNow.AddDays(-10),
                        Description = "Antibiotic for gastrointestinal infections.",
                        Diagnosis = "Intestinal parasites.",
                        VeterinarianId = Guid.Parse("c2ad823a-c3bc-49cb-a930-2fd719c0e997"), // Veterinarian 1
                        AnimalId = Guid.Parse("b4e645e1-4a28-45a2-9aa3-3b76af8a5f12") // Luna
                    },
                    new MedicationSchedule
                    {
                        Id = Guid.NewGuid(),
                        Drug = "Gabapentin",
                        Count = 5,
                        Unit = Unit.day,
                        Start = DateTime.UtcNow.AddDays(-7),
                        End = DateTime.UtcNow.AddDays(-2),
                        Description = "Pain relief medication.",
                        Diagnosis = "Arthritis.",
                        VeterinarianId = Guid.Parse("ad2d34eb-d2a8-4e0a-9a17-c0d295d8995a"), // Veterinarian 2
                        AnimalId = Guid.Parse("fd3cdefe-4f69-40f4-86fa-b2a3ad0b02f8") // Charlie
                    },
                    new MedicationSchedule
                    {
                        Id = Guid.NewGuid(),
                        Drug = "Furosemide",
                        Count = 1,
                        Unit = Unit.month,
                        Start = DateTime.UtcNow.AddDays(-5),
                        End = DateTime.UtcNow.AddDays(0),
                        Description = "Diuretic for heart disease management.",
                        Diagnosis = "Congestive heart failure.",
                        VeterinarianId = Guid.Parse("c2ad823a-c3bc-49cb-a930-2fd719c0e997"), // Veterinarian 1
                        AnimalId = Guid.Parse("8b6c94e7-5ea9-4e56-a0c6-5586f01fa570") // Lucy
                    },
                    new MedicationSchedule
                    {
                        Id = Guid.NewGuid(),
                        Drug = "Enrofloxacin",
                        Count = 2,
                        Unit = Unit.week,
                        Start = DateTime.UtcNow.AddDays(-3),
                        End = DateTime.UtcNow.AddDays(2),
                        Description = "Broad-spectrum antibiotic.",
                        Diagnosis = "Urinary tract infection.",
                        VeterinarianId = Guid.Parse("ad2d34eb-d2a8-4e0a-9a17-c0d295d8995a"), // Veterinarian 2
                        AnimalId = Guid.Parse("be7426eb-8305-46f3-9d59-dbd2bf0d6fa3") // Milo
                    }
                );
                await context.SaveChangesAsync();
            }
        }
    }
}
