using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;
using AnimalCare.Data;
using AnimalCare.Models;
using AnimalCare.Repositories;

namespace AnimalCare.Tests
{
    public class RepositoriesConfigurationTest : IDisposable
    {
        private readonly ServiceProvider _serviceProvider;
        private readonly AnimalCareDbContext _context;

        public RepositoriesConfigurationTest()
        {
            var serviceCollection = new ServiceCollection();
            serviceCollection.AddDbContext<AnimalCareDbContext>(options =>
                options.UseInMemoryDatabase("AnimalCareTestDb"));
            serviceCollection.AddScoped<IAnimalRepository, AnimalRepository>();
            _serviceProvider = serviceCollection.BuildServiceProvider();
            _context = _serviceProvider.GetRequiredService<AnimalCareDbContext>();
            SeedDatabase();
        }

        private void SeedDatabase()
        {
            _context.Animals.AddRange(
                new Animal { Id = 1, Name = "Dog", Age = 5 },
                new Animal { Id = 2, Name = "Cat", Age = 3 }
            );
            _context.SaveChanges();
        }

        [Fact]
        public void GetAllAnimals_ShouldReturnAllAnimals()
        {
            var repository = _serviceProvider.GetRequiredService<IAnimalRepository>();
            var animals = repository.GetAllAnimals().ToList();

            Assert.Equal(2, animals.Count);
            Assert.Contains(animals, a => a.Name == "Dog");
            Assert.Contains(animals, a => a.Name == "Cat");
        }

        [Fact]
        public void GetAnimalById_ShouldReturnCorrectAnimal()
        {
            var repository = _serviceProvider.GetRequiredService<IAnimalRepository>();
            var animal = repository.GetAnimalById(1);

            Assert.NotNull(animal);
            Assert.Equal("Dog", animal.Name);
        }

        [Fact]
        public void AddAnimal_ShouldAddAnimalToDatabase()
        {
            var repository = _serviceProvider.GetRequiredService<IAnimalRepository>();
            var newAnimal = new Animal { Id = 3, Name = "Bird", Age = 2 };

            repository.AddAnimal(newAnimal);
            _context.SaveChanges();

            var animal = _context.Animals.Find(3);
            Assert.NotNull(animal);
            Assert.Equal("Bird", animal.Name);
        }

        [Fact]
        public void UpdateAnimal_ShouldUpdateAnimalInDatabase()
        {
            var repository = _serviceProvider.GetRequiredService<IAnimalRepository>();
            var animal = _context.Animals.Find(1);
            animal.Name = "Updated Dog";

            repository.UpdateAnimal(animal);
            _context.SaveChanges();

            var updatedAnimal = _context.Animals.Find(1);
            Assert.Equal("Updated Dog", updatedAnimal.Name);
        }

        [Fact]
        public void DeleteAnimal_ShouldRemoveAnimalFromDatabase()
        {
            var repository = _serviceProvider.GetRequiredService<IAnimalRepository>();
            var animal = _context.Animals.Find(1);

            repository.DeleteAnimal(animal);
            _context.SaveChanges();

            var deletedAnimal = _context.Animals.Find(1);
            Assert.Null(deletedAnimal);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
            _serviceProvider.Dispose();
        }
    }
}