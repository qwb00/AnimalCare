using AutoMapper;
using Contracts;
using Service.Contracts;

namespace Service
{
    public class ReservationService : IReservationService
    {
        private readonly IRepositoryManager _repository;
        private readonly IMapper _mapper;

        public ReservationService(IRepositoryManager repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
    }
}
