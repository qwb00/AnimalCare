using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Models.Entities;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Repositories
{
    public class RepositoryContext : IdentityDbContext<User>
    {
        public DbSet<Animal>? Animals { get; set; }
        public DbSet<HealthRecord>? HealthRecords { get; set; }
        public DbSet<Reservation>? Reservations { get; set; }
        public DbSet<WalkSchedule>? WalkSchedules { get; set; }
        public DbSet<Request>? Requests { get; set; }

        public RepositoryContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasDiscriminator<string>("UserType")
                .HasValue<Administrator>("Administrator")
                .HasValue<CareTaker>("CareTaker")
                .HasValue<Veterinarian>("Veterinarian")
                .HasValue<Volunteer>("Volunteer");

            ConfigureUserEntity(modelBuilder);
            ConfigureCareTakerEntity(modelBuilder);
            ConfigureVeterinarianEntity(modelBuilder);
            ConfigureVolunteerEntity(modelBuilder);
            ConfigureAnimalEntity(modelBuilder);
            ConfigureWalkScheduleEntity(modelBuilder);

        }

        private void ConfigureUserEntity(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(user => user.Email)
                .IsUnique();
            modelBuilder.Entity<User>()
                .HasIndex(user => user.PhoneNumber)
                .IsUnique();
        }
        
        private void ConfigureCareTakerEntity(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CareTaker>()
                 .HasMany(user => user.Reservations)
                 .WithOne(r => r.CareTaker)
                 .HasForeignKey(r => r.CareTakerId)
                 .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<CareTaker>()
                 .HasMany(user => user.Schedules)
                 .WithOne(r => r.CareTaker)
                 .HasForeignKey(r => r.CareTakerId)
                 .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<CareTaker>()
                 .HasMany(user => user.Requests)
                 .WithOne(r => r.CareTaker)
                 .HasForeignKey(r => r.CareTakerId)
                 .OnDelete(DeleteBehavior.Cascade);
        }
        private void ConfigureVeterinarianEntity(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Veterinarian>()
                 .HasMany(user => user.Records)
                 .WithOne(r => r.Veterinarian)
                 .HasForeignKey(r => r.VeterinarianId)
                 .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Veterinarian>()
                 .HasMany(user => user.Requests)
                 .WithOne(r => r.Veterinarian)
                 .HasForeignKey(r => r.VeterinarianId)
                 .OnDelete(DeleteBehavior.Cascade);
        }
        private void ConfigureVolunteerEntity(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Volunteer>()
                 .HasMany(user => user.Reservations)
                 .WithOne(r => r.Volunteer)
                 .HasForeignKey(r => r.VolunteerId)
                 .OnDelete(DeleteBehavior.Cascade);
        }
        private void ConfigureAnimalEntity(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Animal>()
                 .HasMany(a => a.HealthRecords)
                 .WithOne(r => r.Animal)
                 .HasForeignKey(r => r.AnimalId)
                 .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Animal>()
                 .HasMany(a => a.WalkSchedules)
                 .WithOne(r => r.Animal)
                 .HasForeignKey(r => r.AnimalId)
                 .OnDelete(DeleteBehavior.Cascade);
        }
        private void ConfigureWalkScheduleEntity(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<WalkSchedule>()
                 .HasMany(a => a.Reservations)
                 .WithOne(r => r.WalkSchedule)
                 .HasForeignKey(r => r.WalkScheduleId)
                 .OnDelete(DeleteBehavior.Cascade);
        }

    }
}
