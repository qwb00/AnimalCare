using Contracts;


namespace Repositories
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly RepositoryContext _repositoryContext;
        private readonly Lazy<IAnimalRepository> _animalRepository;
        private readonly Lazy<IExaminationRepository> _examinationRepository;
        private readonly Lazy<IReservationRepository> _reservationRepository;
        private readonly Lazy<IMedicationRepository> _medicationRepository;

        public RepositoryManager(RepositoryContext repositoryContext)
        {
            _repositoryContext = repositoryContext;
            _animalRepository = new Lazy<IAnimalRepository>(() => new AnimalRepository(repositoryContext));
            _examinationRepository = new Lazy<IExaminationRepository>(() => new ExaminationRepository(repositoryContext));
            _reservationRepository = new Lazy<IReservationRepository>(() => new ReservationRepository(repositoryContext));
            _medicationRepository = new Lazy<IMedicationRepository>(() => new MedicationRepository(repositoryContext));
        }

        public IAnimalRepository Animal => _animalRepository.Value;
        public IExaminationRepository Examination => _examinationRepository.Value;
        public IReservationRepository Reservation => _reservationRepository.Value;
        public IMedicationRepository Medication => _medicationRepository.Value;

        public async Task SaveAsync() => await _repositoryContext.SaveChangesAsync();
    }
}
