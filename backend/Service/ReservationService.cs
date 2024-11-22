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

        public async Task<IEnumerable<ReservationForConfirmationDto>> GetAllReservationsAsync(bool trackChanges)
        {
            var reservations = await _repository.Reservation.GetAllReservationsAsync(trackChanges);
            var reservationsDto = _mapper.Map<IEnumerable<ReservationForConfirmationDto>>(reservations);
            return reservationsDto;
        }

        public async Task<ReservationForConfirmationDto> GetReservationByIdAsync(Guid reservationId, bool trackChanges)
        {
            var reservation = await GetReservationAndCheckIfItExists(reservationId, trackChanges);
            var reservationDto = _mapper.Map<ReservationForConfirmationDto>(reservation);
            return reservationDto;
        }
        
        public async Task<ReservationForUpdateDto> GetReservationForPatchAsync(Guid reservationId, bool trackChanges)
        {
            var reservationEntity = await GetReservationAndCheckIfItExists(reservationId, trackChanges);

            var reservationToPatch = _mapper.Map<ReservationForUpdateDto>(reservationEntity);
            return reservationToPatch;
        }
        
        public async Task SavePatchedReservationAsync(Guid reservationId, ReservationForUpdateDto reservationToPatch, bool trackChanges)
        {
            var reservationEntity = await GetReservationAndCheckIfItExists(reservationId, trackChanges);

            _mapper.Map(reservationToPatch, reservationEntity);

            await _repository.SaveAsync();
        }

        public async Task<ReservationForConfirmationDto> CreateReservationAsync(ReservationForCreationDto reservationRequest)
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

            var reservationToReturn = _mapper.Map<ReservationForConfirmationDto>(reservationFromDb);
            return reservationToReturn;
        }

        public async Task UpdateReservationAsync(Guid reservationId, ReservationForUpdateDto reservationForUpdate, bool trackChanges)
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
        
        public async Task<IEnumerable<ReservationForUserDto>> GetReservationsByVolunteerIdAsync(Guid volunteerId, bool trackChanges)
        {
            var reservations = await _repository.Reservation.GetReservationsByVolunteerIdAsync(volunteerId, trackChanges);
            var reservationsDto = _mapper.Map<IEnumerable<ReservationForUserDto>>(reservations);
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
