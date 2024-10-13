using AutoMapper;
using Contracts;
using Service.Contracts;

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
    }
}
