using Contracts;
using Microsoft.EntityFrameworkCore;
using Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
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
            await GetAll(trackChanges).OrderBy(c => c.StartDate).ToListAsync();
        public async Task<IEnumerable<Reservation>> GetReservationsAsync(Guid volunteerId, bool trackChanges)
            => await GetByCondition(e => e.VolunteerId.Equals(volunteerId), trackChanges).ToListAsync();

        public void CreateReservation(Reservation reservation, Guid volunteerId)
        {
            reservation.VolunteerId = volunteerId;
            Create(reservation);
        }
        
        // gets all unended reservations for caretaker
        public async Task<IEnumerable<Reservation>> GetUnapprovedReservationsAsync(bool trackChanges)
        {
            return await GetByCondition(r => !r.IsEnded, trackChanges).ToListAsync();
        }
        
        //gets all approvedd reservations
        public async Task<IEnumerable<Reservation>> GetApprovedReservationsAsync(bool trackChanges)
        {
            return await GetByCondition(r => r.isAproved, trackChanges).ToListAsync();
        }

	    public async Task<IEnumerable<Reservation>> GetReservationsByDateRangeAsync(DateTime startDate, DateTime endDate, bool trackChanges)
		{
    		return await GetByCondition(
        		r => r.StartDate >= startDate && r.EndDate <= endDate,
        		trackChanges,
        		r => r.Animal,
        		r => r.Volunteer)
    			.OrderBy(r => r.StartDate)
    			.ToListAsync();
		}
		public async Task<IEnumerable<Reservation>> GetReservationsByAnimalNameAsync(string animalName, bool trackChanges)
		{
			return await GetByCondition(
				r => r.Animal != null && r.Animal.Name.Equals(animalName),
				trackChanges,
				r => r.Animal,
				r => r.Volunteer)
				.OrderBy(r => r.StartDate)
				.ToListAsync();
		}
		public async Task<IEnumerable<Reservation>> GetReservationsByVolunteerNameAsync(string volunteerName, bool trackChanges)
		{
    		return await GetByCondition(
        		r => r.Volunteer != null && r.Volunteer.FullName.Equals(volunteerName),
        		trackChanges,
        		r => r.Animal,
        		r => r.Volunteer)
    			.OrderBy(r => r.StartDate)
    			.ToListAsync();
		}
		
		
    }
}
