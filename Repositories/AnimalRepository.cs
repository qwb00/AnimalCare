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
            await GetAll(trackChanges, r => r.Reservations, e => e.Examinations).OrderBy(c => c.Name).ToListAsync();

        #pragma warning disable CS8603 // Possible null reference return.
        public async Task<Animal> GetAnimalByNameAsync(string name, bool trackChanges) =>
            await GetByCondition(c => c.Name.Equals(name), trackChanges)
        .SingleOrDefaultAsync();

        public void CreateAnimal(Animal animal) => Create(animal);
        
        public async Task<IEnumerable<Animal>> GetThreeAnimalsAsync(bool trackChanges)
        {
            var animals = await GetAll(trackChanges).ToListAsync();
            var dogs = animals.Where(a => a.Species == Shared.Enums.Species.Dog).ToList();
            var cats = animals.Where(a => a.Species == Shared.Enums.Species.Cat).ToList();
            if (dogs.Any() && cats.Any())
            {
                return animals.Take(3).ToList();
            }

            return Enumerable.Empty<Animal>();
        }
        
        public async Task<DateTime?> GetLastExaminationDateAsync(Guid animalId, bool trackChanges)
        {
            var animal = await GetByCondition(a => a.Id == animalId, trackChanges)
                .Include(a => a.Examinations)
                .FirstOrDefaultAsync();

            if (animal == null || !animal.Examinations.Any())
            {
                return null;
            }

            return animal.Examinations.Max(r => r.Date);
        }
    }
}
