using Service.Contracts;
using Contracts;
using Microsoft.AspNetCore.Identity;
using Models.Entities;
using AutoMapper;

namespace Service
{
    public class ServiceManager : IServiceManager
    {
        private readonly Lazy<IAnimalService> _animalService;
        private readonly Lazy<IExaminationService> _examinationService;
        private readonly Lazy<IReservationService> _reservationService;

        public ServiceManager(IRepositoryManager repositoryManager, IMapper mapper, UserManager<User> userManager)
        {
            _animalService = new Lazy<IAnimalService>(() => new AnimalService(repositoryManager, mapper));
            _examinationService = new Lazy<IExaminationService>(() => new ExaminationService(repositoryManager, mapper));
            _reservationService = new Lazy<IReservationService>(() => new ReservationService(userManager, mapper));
        }

        public IAnimalService AnimalService => _animalService.Value;
        public IExaminationService ExaminationService => _examinationService.Value;
        public IReservationService ReservationService => _reservationService.Value;
    }
}
