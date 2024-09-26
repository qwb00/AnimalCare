using Models.Entities;

namespace Contracts
{
    public interface IAnimalRepository : IRepo<Animal>
    {
        Task<IEnumerable<Animal>> GetAllAnimalsAsync(bool trackChanges);
    }
}
