using System.Linq.Expressions;
using Models.Entities;

namespace Contracts
{
    public interface IReservationRepository : IRepository<Reservation>
    {
        Task<IEnumerable<Reservation>> GetAllReservationsAsync(bool trackChanges);
        Task<Reservation> GetReservationByIdAsync(Guid reservationId, bool trackChanges, params Expression<Func<Reservation, object>>[] includes);
        Task<IEnumerable<Reservation>> GetReservationsByVolunteerIdAsync(Guid volunteerId, bool trackChanges);
        void CreateReservation(Reservation reservation);
    }
}
