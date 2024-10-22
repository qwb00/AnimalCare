﻿using Models.Entities;
using Shared.DataTransferObjects.AnimalsDTO;

namespace Service.Contracts
{
    public interface IAnimalService
    {
        Task<IEnumerable<AnimalForCardsDto>> GetAllAnimalsAsync(bool trackChanges);
        Task<AnimalDetailedDto> GetAnimalAsync(Guid id, bool trackChanges);
        Task<AnimalDetailedDto> CreateAnimalAsync(AnimalForCreating animal);
        Task UpdateAnimalAsync(Guid animalId, AnimalForUpdateDTO animalForUpdate, bool trackChanges);
        Task DeleteAnimalAsync(Guid animalId, bool trackChanges);
    }
}
