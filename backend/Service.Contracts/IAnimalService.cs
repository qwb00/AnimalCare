using Models.Entities;
using Shared.DataTransferObjects.AnimalsDTO;
using Shared.RequestFeatures;

namespace Service.Contracts
{
    public interface IAnimalService
    {
        Task<IEnumerable<AnimalForCardsDto>> GetAllAnimalsAsync(AnimalParameters animalParameters, bool trackChanges);
        Task<AnimalDetailedDto> GetAnimalAsync(Guid id, bool trackChanges);
        Task<AnimalDetailedDto> CreateAnimalAsync(AnimalForCreatingDTO animal);
        Task UpdateAnimalAsync(Guid animalId, AnimalForUpdateDTO animalForUpdate, bool trackChanges);

        Task<(AnimalForUpdateDTO animalForPatch, Animal animalEntity)> GetAnimalForPatchAsync(Guid id);
        Task SaveChangesForPatchAsync(AnimalForUpdateDTO patch, Animal animal);
        Task DeleteAnimalAsync(Guid animalId, bool trackChanges);
    }
}
