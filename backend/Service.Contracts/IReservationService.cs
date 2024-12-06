

using Shared.DataTransferObjects;
using Shared.DataTransferObjects.ReservationsDTO;

namespace Service.Contracts
{
    public interface IReservationService
    {
        Task<IEnumerable<ReservationForConfirmationDTO>> GetAllReservationsAsync(bool trackChanges, string? animalName = null, string? breed = null);
        Task<ReservationForConfirmationDTO> GetReservationByIdAsync(Guid reservationId, bool trackChanges);
        Task<ReservationForConfirmationDTO> CreateReservationAsync(ReservationForCreationDTO reservationRequest);
        Task UpdateReservationAsync(Guid reservationId, ReservationForUpdateDTO reservationForUpdate, bool trackChanges);
        Task DeleteReservationAsync(Guid reservationId, bool trackChanges);
        // Additional methods for getting user's reservations
        Task<IEnumerable<ReservationForUserDTO>> GetReservationsByVolunteerIdAsync(Guid volunteerId, bool trackChanges);
        Task<ReservationForUpdateDTO> GetReservationForPatchAsync(Guid reservationId, bool trackChanges);

        Task SavePatchedReservationAsync(Guid reservationId, ReservationForUpdateDTO reservationToPatch,
            bool trackChanges);
    }
}
