using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Models.Entities;
using System;

namespace Repositories.Configuration
{
    public class UsersConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasData(
                new User
                {
                    Id = Guid.NewGuid(),
                    Email = "admin1@gmail.com",
                    PasswordHash = "admin123", // In a real application, passwords should be hashed
                    FullName = "Admin One",
                    PhoneNumber = "12345678",
                    IsVerified = true,
                    Role = "Administrator"
                },
                new User
                {
                    Id = Guid.NewGuid(),
                    Email = "vet1@gmail.com",
                    PasswordHash = "vet123", // In a real application, passwords should be hashed
                    FullName = "Veterinarian One",
                    PhoneNumber = "12345678",
                    IsVerified = true,
                    Role = "Veterinarian"
                },
                new User
                {
                    Id = Guid.NewGuid(),
                    Email = "vet2@gmail.com",
                    PasswordHash = "vet123", // In a real application, passwords should be hashed
                    FullName = "Veterinarian Two",
                    PhoneNumber = "12345678",
                    IsVerified = true,
                    Role = "Veterinarian"
                },
                new User
                {
                    Id = Guid.NewGuid(),
                    Email = "caretaker1@gmail.com",
                    PasswordHash = "caretaker123", // In a real application, passwords should be hashed
                    FullName = "Caretaker One",
                    PhoneNumber = "12345678",
                    IsVerified = true,
                    Role = "Caretaker"
                },
                new User
                {
                    Id = Guid.NewGuid(),
                    Email = "caretaker2@gmail.com",
                    PasswordHash = "caretaker123", // In a real application, passwords should be hashed
                    FullName = "Caretaker Two",
                    PhoneNumber = "12345678",
                    IsVerified = true,
                    Role = "Caretaker"
                },
                new User
                {
                    Id = Guid.NewGuid(),
                    Email = "volunteer1@gmail.com",
                    PasswordHash = "client123", // In a real application, passwords should be hashed
                    FullName = "Volunteer One",
                    PhoneNumber = "12345678",
                    IsVerified = false,
                    Role = "Volunteer"
                },
                new User
                {
                    Id = Guid.NewGuid(),
                    Email = "volunteer2@gmail.com",
                    PasswordHash = "client123", // In a real application, passwords should be hashed
                    FullName = "Volunteer Two",
                    PhoneNumber = "12345678",
                    IsVerified = false,
                    Role = "Volunteer"
                },
                new User
                {
                    Id = Guid.NewGuid(),
                    Email = "volunteer3@gmail.com",
                    PasswordHash = "client123", // In a real application, passwords should be hashed
                    FullName = "Volunteer Three",
                    PhoneNumber = "12345678",
                    IsVerified = false,
                    Role = "Volunteer"
                },
                new User
                {
                    Id = Guid.NewGuid(),
                    Email = "volunteer4@gmail.com",
                    PasswordHash = "client123", // In a real application, passwords should be hashed
                    FullName = "Volunteer Four",
                    PhoneNumber = "12345678",
                    IsVerified = false,
                    Role = "Volunteer"
                }
            );
        }
    }
}