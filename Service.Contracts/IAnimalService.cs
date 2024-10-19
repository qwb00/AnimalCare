using Models.Entities;
using Shared.DataTransferObjects;

namespace Service.Contracts
{
    public interface IAnimalService
    {
        Task<IEnumerable<AnimalForCardsDto>> GetAllAnimalsAsync(bool trackChanges);
        Task<AnimalDetailedDto> GetAnimalAsync(Guid id, bool trackChanges);
    }
}
