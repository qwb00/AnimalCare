using Models.Entities;
using Shared.RequestFeatures;

namespace Contracts
{
    public interface IAnimalRepository : IRepository<Animal>
    {
        Task<IEnumerable<Animal>> GetAllAnimalsAsync(AnimalParameters animalParameters, bool trackChanges);
        Task<Animal> GetAnimalByNameAsync(string name, bool trackChanges);
        void CreateAnimal(Animal animal);
    }
}
