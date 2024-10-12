using Contracts;


namespace Repositories
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly RepositoryContext _repositoryContext;
        private readonly Lazy<IAnimalRepository> _animalRepository;
        private readonly Lazy<IExaminationRepository> _examinationRepository;
        private readonly Lazy<IReservationRepository> _reservationRepository;

        public RepositoryManager(RepositoryContext repositoryContext)
        {
            _repositoryContext = repositoryContext;
            _animalRepository = new Lazy<IAnimalRepository>(() => new AnimalRepository(repositoryContext));
            _examinationRepository = new Lazy<IExaminationRepository>(() => new ExaminationRepository(repositoryContext));
            _reservationRepository = new Lazy<IReservationRepository>(() => new ReservationRepository(repositoryContext));
        }

        public IAnimalRepository Animal => _animalRepository.Value;
        public IExaminationRepository Examination => _examinationRepository.Value;
        public IReservationRepository Reservation => _reservationRepository.Value;

        public async Task SaveAsync() => await _repositoryContext.SaveChangesAsync();
        public async ValueTask DisposeAsync() => await _repositoryContext.DisposeAsync().ConfigureAwait(false);
    }
}
