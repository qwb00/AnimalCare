using Contracts;
using Microsoft.EntityFrameworkCore;
using Models.Entities;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Repositories
{
    public class AnimalRepository : RepositoryBase<Animal>, IAnimalRepository
    {
        public AnimalRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<IEnumerable<Animal>> GetAllAnimalsAsync(bool trackChanges) =>
            await GetAll(trackChanges).OrderBy(c => c.Name).ToListAsync();

        public async Task<Animal> GetAnimalByNameAsync(string name, bool trackChanges)
        {
            var animal = await GetByCondition(c => c.Name != null && c.Name.Equals(name), trackChanges)
                .SingleOrDefaultAsync();

            if (animal == null)
            {
                throw new KeyNotFoundException($"Animal with name '{name}' was not found.");
            }

            return animal;
        }



        public void CreateAnimal(Animal animal) => Create(animal);
    }
}
