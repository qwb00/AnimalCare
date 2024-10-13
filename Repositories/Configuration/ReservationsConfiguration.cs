using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using AnimalCare.Models;

namespace AnimalCare.Repositories.Configuration
{
    public class ReservationsConfiguration : IEntityTypeConfiguration<Reservation>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<Reservation> builder)
        {
            builder.HasData(
                new Reservation
                {
                    Id = 1,
                    AnimalId = 1,
                    WalkerId = 1,
                    WalkDate = new DateTime(2023, 10, 1, 10, 0, 0),
                    Duration = TimeSpan.FromHours(1),
                    AnimalName = "Bella",
                    WalkerName = "John Doe"
                },
                new Reservation
                {
                    Id = 2,
                    AnimalId = 2,
                    WalkerId = 2,
                    WalkDate = new DateTime(2023, 10, 2, 14, 0, 0),
                    Duration = TimeSpan.FromHours(1.5),
                    AnimalName = "Max",
                    WalkerName = "Jane Smith"
                },
                new Reservation
                {
                    Id = 3,
                    AnimalId = 3,
                    WalkerId = 3,
                    WalkDate = new DateTime(2023, 10, 3, 9, 0, 0),
                    Duration = TimeSpan.FromHours(2),
                    AnimalName = "Luna",
                    WalkerName = "Emily Johnson"
                },
                new Reservation
                {
                    Id = 4,
                    AnimalId = 4,
                    WalkerId = 4,
                    WalkDate = new DateTime(2023, 10, 4, 11, 0, 0),
                    Duration = TimeSpan.FromHours(1),
                    AnimalName = "Charlie",
                    WalkerName = "Michael Brown"
                }
            );
        }
    }
}