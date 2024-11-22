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
        public async Task<IEnumerable<Reservation>> GetAllReservationsAsync(bool trackChanges) =>
	        await GetAll(trackChanges)
		        .Include(r => r.Animal)
		        .Include(r => r.User)
		        .OrderBy(r => r.StartDate)
		        .ToListAsync();
        
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
