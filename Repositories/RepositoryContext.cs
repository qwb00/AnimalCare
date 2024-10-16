using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Models.Entities;
using Repositories.Configuration;

namespace Repositories
{
    public class RepositoryContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {
        public DbSet<Animal>? Animals { get; set; }
        public DbSet<Reservation>? Reservations { get; set; }
        public DbSet<ExaminationRecord>? Requests { get; set; }

        public RepositoryContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new AnimalsConfiguration());
            modelBuilder.ApplyConfiguration(new ReservationsConfiguration());

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
                 .HasMany(user => user.Requests)
                 .WithOne(r => r.CareTaker)
                 .HasForeignKey(r => r.CareTakerId)
                 .OnDelete(DeleteBehavior.NoAction);
        }
        private void ConfigureVeterinarianEntity(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Veterinarian>()
                 .HasMany(user => user.Requests)
                 .WithOne(r => r.Veterinarian)
                 .HasForeignKey(r => r.VeterinarianId)
                 .OnDelete(DeleteBehavior.NoAction);
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
                 .HasMany(a => a.Reservations)
                 .WithOne(r => r.Animal)
                 .HasForeignKey(r => r.AnimalId)
                 .OnDelete(DeleteBehavior.Cascade);
        }

    }
}
