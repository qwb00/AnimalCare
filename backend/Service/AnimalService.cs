using AutoMapper;
using Contracts;
using Service.Contracts;
using Models.Entities;
using Shared.DataTransferObjects.AnimalsDTO;

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

        public async Task<AnimalDetailedDto> CreateAnimalAsync(AnimalForCreating animal)
        {
            var animalEntity = _mapper.Map<Animal>(animal);

            _repository.Animal.CreateAnimal(animalEntity);
            await _repository.SaveAsync();

            var animalToReturn = _mapper.Map<AnimalDetailedDto>(animalEntity);

            return animalToReturn;
        }

        public async Task DeleteAnimalAsync(Guid animalId, bool trackChanges)
        {
            var animal = await GetAnimalAndCheckIfItExists(animalId, trackChanges);

            _repository.Animal.Delete(animal);
            await _repository.SaveAsync();
        }

        public async Task UpdateAnimalAsync(Guid animalId, AnimalForUpdateDTO animalForUpdate, bool trackChanges)
        {
            var animalEntity = await GetAnimalAndCheckIfItExists(animalId, trackChanges);

            _mapper.Map(animalForUpdate, animalEntity);
            await _repository.SaveAsync();
        }

        public async Task<(AnimalForUpdateDTO animalForPatch, Animal animalEntity)> GetAnimalForPatchAsync(Guid id)
        {
            var animal = await GetAnimalAndCheckIfItExists(id, true);
    
            var animalDTO = _mapper.Map<AnimalForUpdateDTO>(animal);
            return (animalForPatch: animalDTO, animalEntity: animal);
        }

        public async Task SaveChangesForPatchAsync(AnimalForUpdateDTO patch, Animal animal)
        {
            _mapper.Map(patch, animal);
            await _repository.SaveAsync();
        }

        private async Task<Animal> GetAnimalAndCheckIfItExists(Guid id, bool trackChanges)
        {
            var animal = await _repository.Animal.GetByIdAsync(id, trackChanges, e => e.Examinations, e => e.Reservations);
            if (animal is null)
                throw new Exception("Animal not found");

            return animal;
        }
    }
}
