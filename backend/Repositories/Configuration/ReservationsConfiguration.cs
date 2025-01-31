using Microsoft.Extensions.DependencyInjection;
using Models.Entities;
using Shared.Enums;

namespace Repositories.Configuration;

public static class ReservationsConfiguration
{
    public static async Task SeedReservations(RepositoryContext context)
    {
        if (context.Reservations != null && !context.Reservations.Any())
        {
            var today = DateTime.UtcNow.Date;

            context.Reservations.AddRange(
                // Past Reservations
                new Reservation
                {
                    Id = Guid.NewGuid(),
                    AnimalId = Guid.Parse("5bc27217-6817-40e4-b8d1-60dc9aca3e83"), // Bella
                    UserId = Guid.Parse("7d5a7f7b-4a0d-41b6-9b9f-02c68c5d8b98"), // Volunteer 1
                    StartDate = today.AddDays(-5).AddHours(9), // 5 days ago, 9:00 AM
                    EndDate = today.AddDays(-5).AddHours(10), // 10:00 AM
                    Status = ReservationStatus.COMPLETED
                },
                new Reservation
                {
                    Id = Guid.NewGuid(),
                    AnimalId = Guid.Parse("b4e645e1-4a28-45a2-9aa3-3b76af8a5f12"), // Luna
                    UserId = Guid.Parse("7d5a7f7b-4a0d-41b6-9b9f-02c68c5d8b98"), // Volunteer 1
                    StartDate = today.AddDays(-3).AddHours(12), // 3 days ago, 12:00 PM
                    EndDate = today.AddDays(-3).AddHours(13), // 1:00 PM
                    Status = ReservationStatus.MISSED
                },

                // Today's Reservations
                new Reservation
                {
                    Id = Guid.NewGuid(),
                    AnimalId = Guid.Parse("59fe555e-3bcc-4ace-b9fc-68b76805ac59"), // Max
                    UserId = Guid.Parse("c60e1c3e-4632-499f-b948-103558d91c5e"), // Volunteer 2
                    StartDate = today.AddHours(10), // 10:00 AM
                    EndDate = today.AddHours(11), // 11:00 AM
                    Status = ReservationStatus.MISSED
                },
                new Reservation
                {
                    Id = Guid.NewGuid(),
                    AnimalId = Guid.Parse("fd3cdefe-4f69-40f4-86fa-b2a3ad0b02f8"), // Charlie
                    UserId = Guid.Parse("c60e1c3e-4632-499f-b948-103558d91c5e"), // Volunteer 2
                    StartDate = today.AddHours(14), // 2:00 PM
                    EndDate = today.AddHours(15), // 3:00 PM
                    Status = ReservationStatus.CANCELED
                },

                // Future Reservations
                new Reservation
                {
                    Id = Guid.NewGuid(),
                    AnimalId = Guid.Parse("be7426eb-8305-46f3-9d59-dbd2bf0d6fa3"), // Milo
                    UserId = Guid.Parse("7d5a7f7b-4a0d-41b6-9b9f-02c68c5d8b98"), // Volunteer 1
                    StartDate = today.AddDays(2).AddHours(9), // 2 days from today, 9:00 AM
                    EndDate = today.AddDays(2).AddHours(10), // 10:00 AM
                    Status = ReservationStatus.UPCOMING
                },
                new Reservation
                {
                    Id = Guid.NewGuid(),
                    AnimalId = Guid.Parse("8b6c94e7-5ea9-4e56-a0c6-5586f01fa570"), // Lucy
                    UserId = Guid.Parse("c60e1c3e-4632-499f-b948-103558d91c5e"), // Volunteer 2
                    StartDate = today.AddDays(4).AddHours(12), // 4 days from today, 12:00 PM
                    EndDate = today.AddDays(4).AddHours(13), // 1:00 PM
                    Status = ReservationStatus.UPCOMING
                },
                new Reservation
                {
                    Id = Guid.NewGuid(),
                    AnimalId = Guid.Parse("5bc27217-6817-40e4-b8d1-60dc9aca3e83"), // Bella
                    UserId = Guid.Parse("c60e1c3e-4632-499f-b948-103558d91c5e"), // Volunteer 2
                    StartDate = today.AddDays(6).AddHours(10), // 6 days from today, 10:00 AM
                    EndDate = today.AddDays(6).AddHours(11), // 11:00 AM
                    Status = ReservationStatus.UPCOMING
                }
            );

            await context.SaveChangesAsync();
        }
    }
}
