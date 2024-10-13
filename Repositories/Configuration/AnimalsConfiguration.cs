using System;
using System.Collections.Generic;
using Models.Entities;

namespace Repositories.Configuration
{
    public static class AnimalsConfiguration
    {
        public static List<Animal> GetSeedData()
        {
            return new List<Animal>
            {
                new Animal { Id = Guid.NewGuid(), Name = "Bella", Species = "Dog", Breed = "Labrador Retriever", Age = 3, Photo = "", History = "", DateFound = DateTime.Now, Type = "Dog" },
                new Animal { Id = Guid.NewGuid(), Name = "Max", Species = "Dog", Breed = "German Shepherd", Age = 5, Photo = "", History = "", DateFound = DateTime.Now, Type = "Dog" },
                new Animal { Id = Guid.NewGuid(), Name = "Luna", Species = "Cat", Breed = "Siamese", Age = 2, Photo = "", History = "", DateFound = DateTime.Now, Type = "Cat" },
                new Animal { Id = Guid.NewGuid(), Name = "Charlie", Species = "Dog", Breed = "Bulldog", Age = 4, Photo = "", History = "", DateFound = DateTime.Now, Type = "Dog" },
                new Animal { Id = Guid.NewGuid(), Name = "Lucy", Species = "Cat", Breed = "Persian", Age = 3, Photo = "", History = "", DateFound = DateTime.Now, Type = "Cat" },
                new Animal { Id = Guid.NewGuid(), Name = "Milo", Species = "Cat", Breed = "Maine Coon", Age = 1, Photo = "", History = "", DateFound = DateTime.Now, Type = "Cat" }
            };
        }
    }
}