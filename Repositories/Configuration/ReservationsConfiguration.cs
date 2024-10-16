using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Models.Entities;

namespace Repositories.Configuration
{
    public class ReservationsConfiguration : IEntityTypeConfiguration<Reservation>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<Reservation> builder)
        {
            builder.HasData(
                new Reservation
                {
                    Id = Guid.Parse("1ccccccc-cccc-cccc-cccc-cccccccccccc"),
                    AnimalId = Guid.Parse("1aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    VolunteerId = Guid.Parse("bbccccc-cccc-cccc-cccc-cccccccccccc"),
                    StartDate = new DateTime(2023, 10, 1, 10, 0, 0),
                    EndDate = new DateTime(2023, 10, 1, 11, 0, 0),
                    IsEnded = false
                },
                new Reservation
                {
                    Id = Guid.Parse("11cccccc-cccc-cccc-cccc-cccccccccccc"),
                    AnimalId = Guid.Parse("11aaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    VolunteerId = Guid.Parse("bbbccccc-cccc-cccc-cccc-cccccccccccc"),
                    StartDate = new DateTime(2023, 10, 2, 14, 0, 0),
                    EndDate = new DateTime(2023, 10, 2, 15, 30, 0),
                    IsEnded = false
                },
                new Reservation
                {
                    Id = Guid.Parse("111ccccc-cccc-cccc-cccc-cccccccccccc"),
                    AnimalId = Guid.Parse("1aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    VolunteerId = Guid.Parse("bbbccccc-cccc-cccc-cccc-cccccccccccc"),
                    StartDate = new DateTime(2023, 10, 3, 9, 0, 0),
                    EndDate = new DateTime(2023, 10, 3, 11, 0, 0),
                    IsEnded = false
                },
                new Reservation
                {
                    Id = Guid.Parse("1111cccc-cccc-cccc-cccc-cccccccccccc"),
                    AnimalId = Guid.Parse("111aaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    VolunteerId = Guid.Parse("bbbccccc-cccc-cccc-cccc-cccccccccccc"),
                    StartDate = new DateTime(2023, 10, 4, 11, 0, 0),
                    EndDate = new DateTime(2023, 10, 4, 12, 0, 0),
                    IsEnded = false
                }
            );
        }
    }
}
