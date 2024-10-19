using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Models.Entities;

namespace Repositories.Configuration;

public class UsersConfiguration
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

        var roles = new[] { "Administrator", "Veterinarian", "CareTaker", "Volunteer" };
        foreach (var roleName in roles)
        {
            if (await roleManager.FindByNameAsync(roleName) != null) continue;
            var role = new IdentityRole<Guid> { Name = roleName };
            await roleManager.CreateAsync(role);
        }

        if (await userManager.FindByEmailAsync("admin1@gmail.com") == null)
        {
            var admin = new Administrator
            {
                Id = Guid.Parse("980745cb-b407-4b72-9a6b-1d5c9cf6a5ef"),
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
                Id = Guid.Parse("c2ad823a-c3bc-49cb-a930-2fd719c0e997"),
                UserName = "vet1",
                Email = "vet1@gmail.com",
                FullName = "Veterinarian One",
                PhoneNumber = "123456781",
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
                Id = Guid.Parse("ad2d34eb-d2a8-4e0a-9a17-c0d295d8995a"),
                UserName = "vet2",
                Email = "vet2@gmail.com",
                FullName = "Veterinarian 2",
                PhoneNumber = "123456782",
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
                Id = Guid.Parse("e920f477-7f53-4bba-b1b6-d8d9376b4d30"),
                UserName = "caretaker1",
                Email = "caretaker1@gmail.com",
                FullName = "Caretaker One",
                PhoneNumber = "123456783",
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
                Id = Guid.Parse("7d5a7f7b-4a0d-41b6-9b9f-02c68c5d8b98"),
                UserName = "volunteer1",
                Email = "volunteer1@gmail.com",
                FullName = "Volunteer One",
                PhoneNumber = "123456784",
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
                Id = Guid.Parse("c60e1c3e-4632-499f-b948-103558d91c5e"),
                UserName = "volunteer2",
                Email = "volunteer2@gmail.com",
                FullName = "Volunteer 2",
                PhoneNumber = "123456785",
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