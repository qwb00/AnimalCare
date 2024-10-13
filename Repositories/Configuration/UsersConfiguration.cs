using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AnimalCare.Models;

namespace AnimalCare.Repositories.Configuration
{
    public class UsersConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasData(
                new User
                {
                    Id = 1,
                    Email = "admin1@gmail.com",
                    Password = "admin123", // In a real application, passwords should be hashed
                    Name = "Admin One",
                    PhoneNumber = "12345678",
                    IsVerified = true,
                    Role = "Administrator"
                },
                new User
                {
                    Id = 2,
                    Email = "vet1@gmail.com",
                    Password = "vet123", // In a real application, passwords should be hashed
                    Name = "Veterinarian One",
                    PhoneNumber = "12345678",
                    IsVerified = true,
                    Role = "Veterinarian"
                },
                new User
                {
                    Id = 3,
                    Email = "vet2@gmail.com",
                    Password = "vet123", // In a real application, passwords should be hashed
                    Name = "Veterinarian Two",
                    PhoneNumber = "12345678",
                    IsVerified = true,
                    Role = "Veterinarian"
                },
                new User
                {
                    Id = 4,
                    Email = "caretaker1@gmail.com",
                    Password = "caretaker123", // In a real application, passwords should be hashed
                    Name = "Caretaker One",
                    PhoneNumber = "12345678",
                    IsVerified = true,
                    Role = "Caretaker"
                },
                new User
                {
                    Id = 5,
                    Email = "caretaker2@gmail.com",
                    Password = "caretaker123", // In a real application, passwords should be hashed
                    Name = "Caretaker Two",
                    PhoneNumber = "12345678",
                    IsVerified = true,
                    Role = "Caretaker"
                },
                new User
                {
                    Id = 6,
                    Email = "volunteer1@gmail.com",
                    Password = "client123", // In a real application, passwords should be hashed
                    Name = "Volunteer One",
                    PhoneNumber = "12345678",
                    IsVerified = false,
                    Role = "Volunteer"
                },
                new User
                {
                    Id = 7,
                    Email = "volunteer2@gmail.com",
                    Password = "client123", // In a real application, passwords should be hashed
                    Name = "Volunteer Two",
                    PhoneNumber = "12345678",
                    IsVerified = false,
                    Role = "Volunteer"
                },
                new User
                {
                    Id = 8,
                    Email = "volunteer3@gmail.com",
                    Password = "client123", // In a real application, passwords should be hashed
                    Name = "Volunteer Three",
                    PhoneNumber = "12345678",
                    IsVerified = false,
                    Role = "Volunteer"
                },
                new User
                {
                    Id = 9,
                    Email = "volunteer4@gmail.com",
                    Password = "client123", // In a real application, passwords should be hashed
                    Name = "Volunteer Four",
                    PhoneNumber = "12345678",
                    IsVerified = false,
                    Role = "Volunteer"
                }
            );
        }
    }
}