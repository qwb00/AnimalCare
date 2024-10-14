using Models.Entities;

namespace Service.Contracts
{
    public interface IAnimalService
    {
        Task<IEnumerable<Animal>> GetAllAnimalsAsync(bool trackChanges);
    }
}
