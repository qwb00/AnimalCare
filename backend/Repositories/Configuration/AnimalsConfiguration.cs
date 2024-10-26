
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.DependencyInjection;
using Models.Entities;
using Shared.Enums;

namespace Repositories.Configuration
{
    public static class AnimalsConfiguration
    {
        public static async Task SeedAnimalsAsync(RepositoryContext context)
        {
            if (context.Animals != null && !context.Animals.Any())
            {
                context.Animals.AddRange(
                    new Animal
                    {
                        Id = Guid.Parse("5bc27217-6817-40e4-b8d1-60dc9aca3e83"),
                        Name = "Bella",
                        Species = Species.Dog,
                        Breed = "Labrador Retriever",
                        Age = 3,
                        Sex = Sex.Female,
                        Size = Size.Medium,
                        Health = Health.Good,
                        Weight = "25kg",
                        Photo = "https://images.unsplash.com/photo-1537204696486-967f1b7198c8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        History = "Found near a lake.",
                        Personality = "Friendly and energetic.",
                        IsVaccinated = true,
                        IsSterilized = false,
                        IsChipped = true,
                        LastExamination = DateTime.UtcNow.AddDays(-10),
                        IsPeopleFriendly = true,
                        IsAnimalFriendly = true,
                        IsCommandsTaught = true,
                        IsLeashTrained = true,
                        DateFound = DateTime.UtcNow.AddDays(-30)
                    },
                    new Animal
                    {
                        Id = Guid.Parse("59fe555e-3bcc-4ace-b9fc-68b76805ac59"),
                        Name = "Max",
                        Species = Species.Dog,
                        Breed = "German Shepherd",
                        Age = 5,
                        Sex = Sex.Male,
                        Size = Size.Large,
                        Health = Health.Fair,
                        Weight = "30kg",
                        Photo = "https://images.unsplash.com/photo-1633564522273-2b2a3f21d860?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        History = "Owner surrendered due to moving.",
                        Personality = "Loyal and protective.",
                        IsVaccinated = false,
                        IsSterilized = false,
                        IsChipped = false,
                        LastExamination = DateTime.UtcNow.AddDays(-20),
                        IsPeopleFriendly = true,
                        IsAnimalFriendly = true,
                        IsCommandsTaught = true,
                        IsLeashTrained = true,
                        DateFound = DateTime.UtcNow.AddDays(-40)
                    },
                    new Animal
                    {
                        Id = Guid.Parse("b4e645e1-4a28-45a2-9aa3-3b76af8a5f12"),
                        Name = "Luna",
                        Species = Species.Cat,
                        Breed = "Siamese",
                        Age = 2,
                        Sex = Sex.Female,
                        Size = Size.Small,
                        Health = Health.Good,
                        Weight = "4kg",
                        Photo = "https://images.unsplash.com/photo-1636898057742-a3a8ab329137?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        History = "Rescued from an abandoned building.",
                        Personality = "Calm and affectionate.",
                        IsVaccinated = true,
                        IsSterilized = true,
                        IsChipped = true,
                        LastExamination = DateTime.UtcNow.AddDays(-5),
                        IsPeopleFriendly = true,
                        IsAnimalFriendly = false,
                        IsCommandsTaught = false,
                        IsLeashTrained = false,
                        DateFound = DateTime.UtcNow.AddDays(-20)
                    },
                    new Animal
                    {
                        Id = Guid.Parse("fd3cdefe-4f69-40f4-86fa-b2a3ad0b02f8"),
                        Name = "Charlie",
                        Species = Species.Dog,
                        Breed = "Bulldog",
                        Age = 4,
                        Sex = Sex.Male,
                        Size = Size.Medium,
                        Health = Health.Good,
                        Weight = "20kg",
                        Photo = "https://images.unsplash.com/photo-1509046856099-5ca77b63600e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        History = "Rescued from a busy highway.",
                        Personality = "Energetic and friendly.",
                        IsVaccinated = true,
                        IsSterilized = true,
                        IsChipped = true,
                        LastExamination = DateTime.UtcNow.AddDays(-7),
                        IsPeopleFriendly = true,
                        IsAnimalFriendly = true,
                        IsCommandsTaught = true,
                        IsLeashTrained = true,
                        DateFound = DateTime.UtcNow.AddDays(-25)
                    },
                    new Animal
                    {
                        Id = Guid.Parse("8b6c94e7-5ea9-4e56-a0c6-5586f01fa570"),
                        Name = "Lucy",
                        Species = Species.Cat,
                        Breed = "Persian",
                        Age = 3,
                        Sex = Sex.Female,
                        Size = Size.Small,
                        Health = Health.Good,
                        Weight = "3.5kg",
                        Photo = "https://images.unsplash.com/photo-1583404283135-ee11fa80b2a2?q=80&w=2032&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        History = "Found near a grocery store.",
                        Personality = "Quiet and affectionate.",
                        IsVaccinated = true,
                        IsSterilized = true,
                        IsChipped = true,
                        LastExamination = DateTime.UtcNow.AddDays(-3),
                        IsPeopleFriendly = true,
                        IsAnimalFriendly = false,
                        IsCommandsTaught = false,
                        IsLeashTrained = false,
                        DateFound = DateTime.UtcNow.AddDays(-15)
                    },
                    new Animal
                    {
                        Id = Guid.Parse("be7426eb-8305-46f3-9d59-dbd2bf0d6fa3"),
                        Name = "Milo",
                        Species = Species.Cat,
                        Breed = "Maine Coon",
                        Age = 1,
                        Sex = Sex.Male,
                        Size = Size.Medium,
                        Health = Health.Good,
                        Weight = "5kg",
                        Photo = "https://images.unsplash.com/photo-1606213651356-0272cc0becd2?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        History = "Abandoned kitten found in a box.",
                        Personality = "Playful and curious.",
                        IsVaccinated = true,
                        IsSterilized = false,
                        IsChipped = false,
                        LastExamination = DateTime.UtcNow.AddDays(-2),
                        IsPeopleFriendly = true,
                        IsAnimalFriendly = true,
                        IsCommandsTaught = false,
                        IsLeashTrained = false,
                        DateFound = DateTime.UtcNow.AddDays(-10)
                    }
                );

            }
        }
    }
}    
