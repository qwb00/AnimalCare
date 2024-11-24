using AutoMapper;
using Contracts;
using Models.Entities;
using Service.Contracts;
using Shared.DataTransferObjects.ReservationsDTO;

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

        public async Task<IEnumerable<ReservationForConfirmationDTO>> GetAllReservationsAsync(bool trackChanges)
        {
            var reservations = await _repository.Reservation.GetAllReservationsAsync(trackChanges);
            var reservationsDto = _mapper.Map<IEnumerable<ReservationForConfirmationDTO>>(reservations);
            return reservationsDto;
        }

        public async Task<ReservationForConfirmationDTO> GetReservationByIdAsync(Guid reservationId, bool trackChanges)
        {
            var reservation = await GetReservationAndCheckIfItExists(reservationId, trackChanges);
            var reservationDto = _mapper.Map<ReservationForConfirmationDTO>(reservation);
            return reservationDto;
        }
        
        public async Task<ReservationForUpdateDTO> GetReservationForPatchAsync(Guid reservationId, bool trackChanges)
        {
            var reservationEntity = await GetReservationAndCheckIfItExists(reservationId, trackChanges);

            var reservationToPatch = _mapper.Map<ReservationForUpdateDTO>(reservationEntity);
            return reservationToPatch;
        }
        
        public async Task SavePatchedReservationAsync(Guid reservationId, ReservationForUpdateDTO reservationToPatch, bool trackChanges)
        {
            var reservationEntity = await GetReservationAndCheckIfItExists(reservationId, trackChanges);

            _mapper.Map(reservationToPatch, reservationEntity);

            await _repository.SaveAsync();
        }

        public async Task<ReservationForConfirmationDTO> CreateReservationAsync(ReservationForCreationDTO reservationRequest)
        {
            var reservationEntity = _mapper.Map<Reservation>(reservationRequest);

            reservationEntity.Id = Guid.NewGuid();
            _repository.Reservation.CreateReservation(reservationEntity);
            await _repository.SaveAsync();

            // Reload the reservation with related entities
            var reservationFromDb = await _repository.Reservation.GetReservationByIdAsync(
                reservationEntity.Id,
                trackChanges: false,
                r => r.Animal,
                r => r.User);

            var reservationToReturn = _mapper.Map<ReservationForConfirmationDTO>(reservationFromDb);
            return reservationToReturn;
        }

        public async Task UpdateReservationAsync(Guid reservationId, ReservationForUpdateDTO reservationForUpdate, bool trackChanges)
        {
            var reservationEntity = await GetReservationAndCheckIfItExists(reservationId, trackChanges);

            _mapper.Map(reservationForUpdate, reservationEntity);
            await _repository.SaveAsync();
        }

        public async Task DeleteReservationAsync(Guid reservationId, bool trackChanges)
        {
            var reservation = await GetReservationAndCheckIfItExists(reservationId, trackChanges);
            _repository.Reservation.Delete(reservation);
            await _repository.SaveAsync();
        }
        
        public async Task<IEnumerable<ReservationForUserDTO>> GetReservationsByVolunteerIdAsync(Guid volunteerId, bool trackChanges)
        {
            var reservations = await _repository.Reservation.GetReservationsByVolunteerIdAsync(volunteerId, trackChanges);
            var reservationsDto = _mapper.Map<IEnumerable<ReservationForUserDTO>>(reservations);
            return reservationsDto;
        }

        private async Task<Reservation> GetReservationAndCheckIfItExists(Guid id, bool trackChanges)
        {
            var reservation = await _repository.Reservation.GetReservationByIdAsync(
                id,
                trackChanges,
                r => r.Animal,
                r => r.User);

            if (reservation == null)
                throw new Exception("Reservation not found");

            return reservation;
        }
    }
}
