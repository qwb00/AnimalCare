using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.DependencyInjection;
using Models.Entities;

namespace Repositories.Configuration
{
    public static class UserInitializer
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

            var roles = new[] { "Administrator", "Veterinarian", "CareTaker", "Volunteer" };
            foreach (var roleName in roles)
            {
                if (await roleManager.FindByNameAsync(roleName) == null)
                {
                    var role = new IdentityRole<Guid> { Name = roleName };
                    await roleManager.CreateAsync(role);
                }
            }

            if (await userManager.FindByEmailAsync("admin1@gmail.com") == null)
            {
                var admin = new Administrator
                {
                    Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    UserName = "admin",
                    Email = "admin1@gmail.com",
                    FullName = "Admin One",
                    PhoneNumber = "12345678",
                    EmailConfirmed = true
                };
                var result = await userManager.CreateAsync(admin, "Admin123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "Administrator");
                }
            }

            if (await userManager.FindByEmailAsync("vet1@gmail.com") == null)
            {
                var vet = new Veterinarian
                {
                    Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    UserName = "vet1",
                    Email = "vet1@gmail.com",
                    FullName = "Veterinarian One",
                    PhoneNumber = "12345678",
                    EmailConfirmed = true
                };
                var result = await userManager.CreateAsync(vet, "Vet123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(vet, "Veterinarian");
                }
            }

            if (await userManager.FindByEmailAsync("vet2@gmail.com") == null)
            {
                var vet = new Veterinarian
                {
                    Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    UserName = "vet2",
                    Email = "vet2@gmail.com",
                    FullName = "Veterinarian 2",
                    PhoneNumber = "12345678",
                    EmailConfirmed = true
                };
                var result = await userManager.CreateAsync(vet, "Vet123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(vet, "Veterinarian");
                }
            }

            if (await userManager.FindByEmailAsync("caretaker1@gmail.com") == null)
            {
                var caretaker = new CareTaker
                {
                    Id = Guid.Parse("bccccccc-cccc-cccc-cccc-cccccccccccc"),
                    UserName = "caretaker1",
                    Email = "caretaker1@gmail.com",
                    FullName = "Caretaker One",
                    PhoneNumber = "12345678",
                    EmailConfirmed = true
                };
                var result = await userManager.CreateAsync(caretaker, "CareTaker123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(caretaker, "CareTaker");
                }
            }

            if (await userManager.FindByEmailAsync("volunteer1@gmail.com") == null)
            {
                var volunteer = new Volunteer
                {
                    Id = Guid.Parse("bbcccccc-cccc-cccc-cccc-cccccccccccc"),
                    UserName = "volunteer1",
                    Email = "volunteer1@gmail.com",
                    FullName = "Volunteer One",
                    PhoneNumber = "12345678",
                    EmailConfirmed = true,
                    IsVerified = false
                };
                var result = await userManager.CreateAsync(volunteer, "Volunteer123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(volunteer, "Volunteer");
                }
            }

            if (await userManager.FindByEmailAsync("volunteer2@gmail.com") == null)
            {
                var volunteer = new Volunteer
                {
                    Id = Guid.Parse("bbbccccc-cccc-cccc-cccc-cccccccccccc"),
                    UserName = "volunteer2",
                    Email = "volunteer2@gmail.com",
                    FullName = "Volunteer 2",
                    PhoneNumber = "12345678",
                    EmailConfirmed = true,
                    IsVerified = true
                };
                var result = await userManager.CreateAsync(volunteer, "Volunteer123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(volunteer, "Volunteer");
                }
            }
        }
    }
}
