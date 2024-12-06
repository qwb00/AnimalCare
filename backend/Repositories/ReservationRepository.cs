using Contracts;
using Microsoft.EntityFrameworkCore;
using Models.Entities;
using System.Linq.Expressions;

namespace Repositories
{
    public class ReservationRepository : RepositoryBase<Reservation>, IReservationRepository
    {
        public ReservationRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }
        
        public async Task<IEnumerable<Reservation>> GetAllReservationsAsync(bool trackChanges, string? animalName = null, string? breed = null)
        {
	        var query = GetAll(trackChanges)
		        .Include(r => r.Animal)
		        .Include(r => r.User)
		        .AsQueryable(); // Преобразование к IQueryable

	        // Применяем фильтры
	        if (!string.IsNullOrWhiteSpace(animalName))
	        {
		        var lowerAnimalName = animalName.ToLower();
		        query = query.Where(r => r.Animal.Name.ToLower().Contains(lowerAnimalName));
	        }

	        if (!string.IsNullOrWhiteSpace(breed))
	        {
		        var lowerBreed = breed.ToLower();
		        query = query.Where(r => r.Animal.Breed.ToLower().Contains(lowerBreed));
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
