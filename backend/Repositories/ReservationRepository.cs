using Contracts;
using Microsoft.EntityFrameworkCore;
using Models.Entities;
using System.Linq.Expressions;
using Shared.RequestFeatures;

namespace Repositories
{
    public class ReservationRepository : RepositoryBase<Reservation>, IReservationRepository
    {
        public ReservationRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }
        
        public async Task<IEnumerable<Reservation>> GetAllReservationsAsync(bool trackChanges, ReservationParameters reservationParameters)
        {
            var query = GetAll(trackChanges)
                .Include(r => r.Animal)
                .Include(r => r.User)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(reservationParameters.AnimalName))
            {
                var lowerAnimalName = reservationParameters.AnimalName.ToLower();
                query = query.Where(r => r.Animal.Name.ToLower().Contains(lowerAnimalName));
            }

            if (!string.IsNullOrWhiteSpace(reservationParameters.Breed))
            {
                var lowerBreed = reservationParameters.Breed.ToLower();
                query = query.Where(r => r.Animal.Breed.ToLower().Contains(lowerBreed));
            }

            if (!string.IsNullOrWhiteSpace(reservationParameters.VolunteerName))
            {
                var lowerVolunteerName = reservationParameters.VolunteerName.ToLower();
                query = query.Where(r => r.User.FullName.ToLower().Contains(lowerVolunteerName));
            }

            if (!string.IsNullOrWhiteSpace(reservationParameters.VolunteerPhoneNumber))
            {
                query = query.Where(r => r.User.PhoneNumber.Contains(reservationParameters.VolunteerPhoneNumber));
            }

            if (reservationParameters.Date.HasValue)
            {
                var targetDate = reservationParameters.Date.Value.Date;
                query = query.Where(r => r.StartDate.Date == targetDate);
            }

            if (reservationParameters.StartTime.HasValue)
            {
                query = query.Where(r => r.StartDate.TimeOfDay >= reservationParameters.StartTime);
            }

            if (reservationParameters.EndTime.HasValue)
            {
                query = query.Where(r => r.EndDate.TimeOfDay <= reservationParameters.EndTime);
            }

            return await query.OrderBy(r => r.StartDate).ToListAsync();
        }
        
        public async Task<IEnumerable<Reservation>> GetReservationsAsync(Guid volunteerId, bool trackChanges)
            => await GetByCondition(e => e.UserId.Equals(volunteerId), trackChanges).ToListAsync();
		
        public async Task<Reservation> GetReservationByIdAsync(Guid reservationId, bool trackChanges, params Expression<Func<Reservation, object>>[] includes)
        {
	        return await GetByCondition(r => r.Id == reservationId, trackChanges, includes).SingleOrDefaultAsync();
        }
        
        public async Task<IEnumerable<Reservation>> GetReservationsByVolunteerIdAsync(Guid volunteerId, bool trackChanges)
        {
	        return await GetByCondition(r => r.UserId == volunteerId, trackChanges)
		        .Include(r => r.Animal)
		        .OrderByDescending(r => r.StartDate)
		        .ToListAsync();
        }
        
        public void CreateReservation(Reservation reservation)
        {
            Create(reservation);
        }
    }
}
