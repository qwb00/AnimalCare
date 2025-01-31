using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Models.Entities;
using Shared.Enums;

namespace Repositories.Configuration;

public class UsersConfiguration
{
    public static async Task InitializeAsync(UserManager<User> userManager, RoleManager<IdentityRole<Guid>> roleManager)
    {
        var roles = new[] { "Administrator", "Veterinarian", "Caretaker", "Volunteer" };
        foreach (var roleName in roles)
        {
            if (await roleManager.FindByNameAsync(roleName) == null)
            {
                var role = new IdentityRole<Guid> { Name = roleName };
                var roleResult = await roleManager.CreateAsync(role);
                if (!roleResult.Succeeded)
                {
                    foreach (var error in roleResult.Errors)
                    {
                        Console.WriteLine($"Error creating role {roleName}: {error.Description}");
                    }
                }
            }
        }

        if (await userManager.FindByEmailAsync("admin1@gmail.com") == null)
        {
            var admin = new Administrator
            {
                Id = Guid.Parse("980745cb-b407-4b72-9a6b-1d5c9cf6a5ef"),
                UserName = "admin",
                Email = "admin1@gmail.com",
                FullName = "Admin One",
                PhoneNumber = "1234567890",
                EmailConfirmed = true,
                isActive = true,
                Photo = "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            };
            var result = await userManager.CreateAsync(admin, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, "Administrator");
            }
            else
            {
                foreach (var error in result.Errors)
                {
                    Console.WriteLine($"Error creating admin user: {error.Description}");
                }
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
                PhoneNumber = "1234567819",
                EmailConfirmed = true,
                isActive = true,
                Photo = "https://images.unsplash.com/photo-1644675272883-0c4d582528d8?q=80&w=2582&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            };
            var result = await userManager.CreateAsync(vet, "Vet123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(vet, "Veterinarian");
            }
            else
            {
                foreach (var error in result.Errors)
                {
                    Console.WriteLine($"Error creating Veterinarian user: {error.Description}");
                }
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
                PhoneNumber = "1234567820",
                EmailConfirmed = true,
                isActive = true,
                Photo = "https://plus.unsplash.com/premium_photo-1670071482460-5c08776521fe?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            };
            var result = await userManager.CreateAsync(vet, "Vet123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(vet, "Veterinarian");
            }
            else
            {
                foreach (var error in result.Errors)
                {
                    Console.WriteLine($"Error creating Veterinarian user: {error.Description}");
                }
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
                PhoneNumber = "1234567830",
                EmailConfirmed = true,
                isActive = true,
                Photo = "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            };
            var result = await userManager.CreateAsync(caretaker, "CareTaker123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(caretaker, "Caretaker");
            }
            else
            {
                foreach (var error in result.Errors)
                {
                    Console.WriteLine($"Error creating caretaker user: {error.Description}");
                }
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
                PhoneNumber = "1234567840",
                EmailConfirmed = true,
                IsVerified = false,
                isActive = true,
                VolunteerStatus = VolunteerStatus.Approved,
                Photo = "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            };
            var result = await userManager.CreateAsync(volunteer, "Volunteer123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(volunteer, "Volunteer");
            }
            else
            {
                foreach (var error in result.Errors)
                {
                    Console.WriteLine($"Error creating volunteer user: {error.Description}");
                }
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
                PhoneNumber = "1234567850",
                EmailConfirmed = true,
                IsVerified = true,
                isActive = true,
                VolunteerStatus = VolunteerStatus.New,
                Photo = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            };
            var result = await userManager.CreateAsync(volunteer, "Volunteer123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(volunteer, "Volunteer");
            }
            else
            {
                foreach (var error in result.Errors)
                {
                    Console.WriteLine($"Error creating volunteer user: {error.Description}");
                }
            }
        }
    }
}