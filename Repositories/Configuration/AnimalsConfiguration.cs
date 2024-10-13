using System.Collections.Generic;
using AnimalCare.Models;

namespace AnimalCare.Repositories.Configuration
{
    public static class AnimalsConfiguration
    {
        public static List<Animal> GetSeedData()
        {
            return new List<Animal>
            {
                new Animal { Id = 1, Name = "Bella", Type = "Dog", Breed = "Labrador Retriever", Age = 3 },
                new Animal { Id = 2, Name = "Max", Type = "Dog", Breed = "German Shepherd", Age = 5 },
                new Animal { Id = 3, Name = "Luna", Type = "Cat", Breed = "Siamese", Age = 2 },
                new Animal { Id = 4, Name = "Charlie", Type = "Dog", Breed = "Bulldog", Age = 4 },
                new Animal { Id = 5, Name = "Lucy", Type = "Cat", Breed = "Persian", Age = 3 },
                new Animal { Id = 6, Name = "Milo", Type = "Cat", Breed = "Maine Coon", Age = 1 }
            };
        }
    }
}