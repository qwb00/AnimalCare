using Models.Entities;

namespace Contracts
{
    public interface IReservationRepository : IRepository<Reservation>
    {
        Task<IEnumerable<Reservation>> GetAllReservationsAsync(bool trackChanges);
        Task<IEnumerable<Reservation>> GetReservationsAsync(Guid volunteerId, bool trackChanges);
        void CreateReservation(Reservation reservation, Guid volunteerId);
    }
}
