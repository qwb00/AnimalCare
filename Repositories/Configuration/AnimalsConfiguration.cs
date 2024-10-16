using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Models.Entities;

namespace Repositories.Configuration
{
    public class AnimalsConfiguration : IEntityTypeConfiguration<Animal>
    {
        public void Configure(EntityTypeBuilder<Animal> builder)
        {
            builder.HasData
            (
                new Animal 
                {
                    Id = Guid.Parse("5bc27217-6817-40e4-b8d1-60dc9aca3e83"),
                    Name = "Bella", 
                    Species = "Dog", 
                    Breed = "Labrador Retriever", 
                    Age = 3, Photo = "", 
                    History = "",
                    DateFound = DateTime.Now, 
                    Type = "Dog" 
                },
                new Animal 
                {
                    Id = Guid.Parse("59fe555e-3bcc-4ace-b9fc-68b76805ac59"),
                    Name = "Max", 
                    Species = "Dog", 
                    Breed = "German Shepherd", 
                    Age = 5, 
                    Photo = "", 
                    History = "", 
                    DateFound = DateTime.Now, 
                    Type = "Dog"
                },
                new Animal 
                {
                    Id = Guid.Parse("b4e645e1-4a28-45a2-9aa3-3b76af8a5f12"),
                    Name = "Luna", 
                    Species = "Cat", 
                    Breed = "Siamese",
                    Age = 2,
                    Photo = "", 
                    History = "", 
                    DateFound = DateTime.Now, 
                    Type = "Cat"
                },
                new Animal 
                {
                    Id = Guid.Parse("fd3cdefe-4f69-40f4-86fa-b2a3ad0b02f8"),
                    Name = "Charlie", 
                    Species = "Dog", 
                    Breed = "Bulldog",
                    Age = 4, 
                    Photo = "",
                    History = "", 
                    DateFound = DateTime.Now, 
                    Type = "Dog" 
                },
                new Animal
                {
                    Id = Guid.Parse("8b6c94e7-5ea9-4e56-a0c6-5586f01fa570"),
                    Name = "Lucy",
                    Species = "Cat", 
                    Breed = "Persian",
                    Age = 3,
                    Photo = "", 
                    History = "", 
                    DateFound = DateTime.Now,
                    Type = "Cat" 
                },
                new Animal 
                {
                    Id = Guid.Parse("be7426eb-8305-46f3-9d59-dbd2bf0d6fa3"),
                    Name = "Milo",
                    Species = "Cat", 
                    Breed = "Maine Coon",
                    Age = 1, 
                    Photo = "",
                    History = "", 
                    DateFound = DateTime.Now, 
                    Type = "Cat" 
                }
            );
        }
    }
}
