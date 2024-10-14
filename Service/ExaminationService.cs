using AutoMapper;
using Contracts;
using Service.Contracts;

namespace Service
{
    public class ExaminationService : IExaminationService
    {
        private readonly IRepositoryManager _repository;
        private readonly IMapper _mapper;

        public ExaminationService(IRepositoryManager repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
    }
}
