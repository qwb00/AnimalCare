using Contracts;
using Microsoft.EntityFrameworkCore;
using Models.Entities;

namespace Repositories
{
    public class AnimalRepository : RepositoryBase<Animal>, IAnimalRepository
    {
        public AnimalRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<IEnumerable<Animal>> GetAllAnimalsAsync(bool trackChanges) =>
            await GetAll(trackChanges).OrderBy(c => c.Name).ToListAsync();

        #pragma warning disable CS8603 // Possible null reference return.
        public async Task<Animal> GetAnimalByNameAsync(string name, bool trackChanges) =>
            await GetByCondition(c => c.Name.Equals(name), trackChanges)
        .SingleOrDefaultAsync();

        public void CreateAnimal(Animal animal) => Create(animal);
        
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
