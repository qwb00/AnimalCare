

using Shared.DataTransferObjects;
using Shared.DataTransferObjects.ReservationsDTO;

namespace Service.Contracts
{
    public interface IReservationService
    {
        Task<IEnumerable<ReservationForConfirmationDto>> GetAllReservationsAsync(bool trackChanges);
        Task<ReservationForConfirmationDto> GetReservationByIdAsync(Guid reservationId, bool trackChanges);
        Task<ReservationForConfirmationDto> CreateReservationAsync(ReservationForCreationDto reservationRequest);
        Task UpdateReservationAsync(Guid reservationId, ReservationForUpdateDto reservationForUpdate, bool trackChanges);
        Task DeleteReservationAsync(Guid reservationId, bool trackChanges);
        // Additional methods for getting user's reservations
        Task<IEnumerable<ReservationForUserDto>> GetReservationsByVolunteerIdAsync(Guid volunteerId, bool trackChanges);
    }
}
