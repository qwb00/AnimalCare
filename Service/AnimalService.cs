using AutoMapper;
using Contracts;
using Service.Contracts;
using Models.Entities;
using Shared.DataTransferObjects;

namespace Service
{
    public class AnimalService : IAnimalService
    {
        private readonly IRepositoryManager _repository;
        private readonly IMapper _mapper;

        public AnimalService(IRepositoryManager repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<AnimalForCardsDto>> GetAllAnimalsAsync(bool trackChanges)
        {
            var animals = await _repository.Animal.GetAllAnimalsAsync(trackChanges);

            var animalsDTO = _mapper.Map<IEnumerable<AnimalForCardsDto>>(animals);
            return animalsDTO;
        }

        public async Task<AnimalDetailedDto> GetAnimalAsync(Guid id, bool trackChanges)
        {
            var animal = await GetAnimalAndCheckIfItExists(id, trackChanges);

            var animalDTO = _mapper.Map<AnimalDetailedDto>(animal);
            return animalDTO;
        }

        public async Task<AnimalDetailedDto> CreateCompanyAsync(AnimalForCreating animal)
        {
            var animalEntity = _mapper.Map<Animal>(animal);

            _repository.Animal.CreateAnimal(animalEntity);
            await _repository.SaveAsync();

            var companyToReturn = _mapper.Map<AnimalDetailedDto>(animalEntity);

            return companyToReturn;
        }

        public async Task DeleteAnimalAsync(Guid animalId, bool trackChanges)
        {
            var animal = await GetAnimalAndCheckIfItExists(animalId, trackChanges);

            _repository.Animal.Delete(animal);
            await _repository.SaveAsync();
        }

        public async Task UpdateCompanyAsync(Guid animalId, AnimalForUpdateDTO animalForUpdate, bool trackChanges)
        {
            var animalEntity = await GetAnimalAndCheckIfItExists(animalId, trackChanges);

            _mapper.Map(animalForUpdate, animalEntity);
            await _repository.SaveAsync();
        }

        private async Task<Animal> GetAnimalAndCheckIfItExists(Guid id, bool trackChanges)
        {
            var animal = await _repository.Animal.GetByIdAsync(id, trackChanges);
            if (animal is null)
                throw new Exception("Animal not found");

            return animal;
        }
    }
}
