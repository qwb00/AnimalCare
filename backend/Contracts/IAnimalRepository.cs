using Models.Entities;

namespace Contracts
{
    public interface IAnimalRepository : IRepository<Animal>
    {
        Task<IEnumerable<Animal>> GetAllAnimalsAsync(bool trackChanges);
        Task<Animal> GetAnimalByNameAsync(string name, bool trackChanges);
        void CreateAnimal(Animal animal);
    }
}
