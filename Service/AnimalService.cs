using AutoMapper;
using Contracts;
using Service.Contracts;
using Models.Entities;

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

        public async Task<IEnumerable<Animal>> GetAllAnimalsAsync(bool trackChanges)
        {
            var companies = await _repository.Animal.GetAllAnimalsAsync(trackChanges);

      //      var animalsDTO = _mapper.Map<IEnumerable<AnimalDTO>>(animals);
      //      return animalsDTO;
            return companies;
        }
    }
}
