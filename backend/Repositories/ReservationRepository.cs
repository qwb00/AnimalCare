using Contracts;
using Microsoft.EntityFrameworkCore;
using Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

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
		        .Include(r => r.Volunteer)
		        .OrderBy(r => r.StartDate)
		        .ToListAsync();
        
        public async Task<IEnumerable<Reservation>> GetReservationsAsync(Guid volunteerId, bool trackChanges)
            => await GetByCondition(e => e.VolunteerId.Equals(volunteerId), trackChanges).ToListAsync();
		
        public async Task<Reservation> GetReservationByIdAsync(Guid reservationId, bool trackChanges, params Expression<Func<Reservation, object>>[] includes)
        {
	        return await GetByCondition(r => r.Id == reservationId, trackChanges, includes).SingleOrDefaultAsync();
        }
        
        public async Task<IEnumerable<Reservation>> GetReservationsByVolunteerIdAsync(Guid volunteerId, bool trackChanges)
        {
	        return await GetByCondition(r => r.VolunteerId == volunteerId, trackChanges)
		        .Include(r => r.Animal)
		        .OrderBy(r => r.StartDate)
		        .ToListAsync();
        }
        
        public void CreateReservation(Reservation reservation)
        {
            Create(reservation);
        }
    }
}
