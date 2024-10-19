using Microsoft.Extensions.DependencyInjection;
using Models.Entities;

namespace Repositories.Configuration;

public static class ReservationsConfiguration
{
    public static async Task SeedReservations(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<RepositoryContext>();

        if (context.Reservations != null && !context.Reservations.Any())
        {
            context.Reservations.AddRange(
                new Reservation
                {
                    Id = Guid.Parse("df1c5c1d-7a55-4b4a-8e2e-bd3f31230f71"),
                    AnimalId = Guid.Parse("5bc27217-6817-40e4-b8d1-60dc9aca3e83"),
                    VolunteerId = Guid.Parse("7d5a7f7b-4a0d-41b6-9b9f-02c68c5d8b98"),
                    StartDate = new DateTime(2023, 10, 1, 10, 0, 0),
                    EndDate = new DateTime(2023, 10, 1, 11, 0, 0),
                    IsEnded = false
                },
                new Reservation
                {
                    Id = Guid.Parse("6f28e7f7-42b2-4d98-a6ae-2fe7d7d6fd6c"),
                    AnimalId = Guid.Parse("59fe555e-3bcc-4ace-b9fc-68b76805ac59"),
                    VolunteerId = Guid.Parse("c60e1c3e-4632-499f-b948-103558d91c5e"),
                    StartDate = new DateTime(2023, 10, 2, 14, 0, 0),
                    EndDate = new DateTime(2023, 10, 2, 15, 30, 0),
                    IsEnded = false
                },
                new Reservation
                {
                    Id = Guid.Parse("982f69fd-6278-4e5d-b896-97e1be5b17d2"),
                    AnimalId = Guid.Parse("5bc27217-6817-40e4-b8d1-60dc9aca3e83"),
                    VolunteerId = Guid.Parse("c60e1c3e-4632-499f-b948-103558d91c5e"),
                    StartDate = new DateTime(2023, 10, 3, 9, 0, 0),
                    EndDate = new DateTime(2023, 10, 3, 11, 0, 0),
                    IsEnded = false
                },
                new Reservation
                {
                    Id = Guid.Parse("a6d5f2e1-c4b1-404e-832d-ebe9f1d0e1d5"),
                    AnimalId = Guid.Parse("b4e645e1-4a28-45a2-9aa3-3b76af8a5f12"),
                    VolunteerId = Guid.Parse("c60e1c3e-4632-499f-b948-103558d91c5e"),
                    StartDate = new DateTime(2023, 10, 4, 11, 0, 0),
                    EndDate = new DateTime(2023, 10, 4, 12, 0, 0),
                    IsEnded = false
                }
            );
            await context.SaveChangesAsync();
        }
    }
}