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
                    Id = Guid.Parse("1aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), 
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
                    Id = Guid.Parse("11aaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), 
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
                    Id = Guid.Parse("111aaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
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
                    Id = Guid.Parse("1111aaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
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
                    Id = Guid.Parse("11111aaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), 
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
                    Id = Guid.Parse("111111aa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
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
