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

    }
}
