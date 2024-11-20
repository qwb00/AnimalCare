
namespace Contracts
{
    public interface IRepositoryManager
    {
        IAnimalRepository Animal { get; }
        IExaminationRepository Examination { get; }
        IReservationRepository Reservation { get; }
        IMedicationRepository Medication { get; }
        Task SaveAsync();
    }
}
