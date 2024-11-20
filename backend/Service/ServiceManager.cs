using Service.Contracts;
using Contracts;
using Microsoft.AspNetCore.Identity;
using Models.Entities;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Service
{
    public class ServiceManager : IServiceManager
    {
        private readonly Lazy<IAnimalService> _animalService;
        private readonly Lazy<IExaminationService> _examinationService;
        private readonly Lazy<IReservationService> _reservationService;
        private readonly Lazy<IUserService> _userService;
        private readonly Lazy<IAuthenticationService> _authenticationService;
        private readonly Lazy<IMedicationService> _medicationService;

        public ServiceManager(IRepositoryManager repositoryManager, IMapper mapper,
            UserManager<User> userManager, IConfiguration configuration)
        {
            _animalService = new Lazy<IAnimalService>(() => new AnimalService(repositoryManager, mapper));
            _examinationService = new Lazy<IExaminationService>(() => new ExaminationService(repositoryManager, mapper));
            _reservationService = new Lazy<IReservationService>(() => new ReservationService(repositoryManager, mapper));
            _userService = new Lazy<IUserService>(() => new UserService(userManager, mapper));
            _authenticationService = new Lazy<IAuthenticationService>(() => new AuthenticationService(mapper, userManager, configuration));
            _medicationService = new Lazy<IMedicationService>(() => new MedicationService(repositoryManager, mapper));
        }

        public IAnimalService AnimalService => _animalService.Value;
        public IExaminationService ExaminationService => _examinationService.Value;
        public IReservationService ReservationService => _reservationService.Value;
        public IAuthenticationService AuthenticationService => _authenticationService.Value;
        public IUserService UserService => _userService.Value;
        public IMedicationService MedicationService => _medicationService.Value;
    }
}
