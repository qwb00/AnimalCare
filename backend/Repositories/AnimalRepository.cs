using Contracts;
using Microsoft.EntityFrameworkCore;
using Models.Entities;
using Repositories.Extensions;
using Shared.RequestFeatures;

namespace Repositories
{
    public class AnimalRepository : RepositoryBase<Animal>, IAnimalRepository
    {
        public AnimalRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<IEnumerable<Animal>> GetAllAnimalsAsync(AnimalParameters animalParameters, bool trackChanges) =>
            await GetAll(trackChanges)
                .FilterAnimals(animalParameters.MinAge, animalParameters.MaxAge, animalParameters.Breed,
                    animalParameters.Sex, animalParameters.Type, animalParameters.Weight)
                .Search(animalParameters.SearchTerm)
                .OrderBy(c => c.Name)
                .ToListAsync();

        #pragma warning disable CS8603 // Possible null reference return.
        public async Task<Animal> GetAnimalByNameAsync(string name, bool trackChanges) =>
            await GetByCondition(c => c.Name.Equals(name), trackChanges)
        .SingleOrDefaultAsync();

        public void CreateAnimal(Animal animal)
        {
            animal.isActive = true;
            Create(animal);
        }
    }
}
