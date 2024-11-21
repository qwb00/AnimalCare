using Contracts;
using Microsoft.EntityFrameworkCore;
using Models.Entities;
using System.Linq.Expressions;

namespace Repositories
{
    public class MedicationRepository : RepositoryBase<MedicationSchedule>, IMedicationRepository
    {
        public MedicationRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<IEnumerable<MedicationSchedule>> GetAllMedicationsAsync(bool trackChanges) =>
            await GetAll(trackChanges).ToListAsync();

        public async Task<MedicationSchedule> GetMedicationByIdAsync(Guid medicationId, bool trackChanges)
        {
            return await GetByCondition(e => e.Id == medicationId, trackChanges).SingleOrDefaultAsync();
        }
        public void CreateMedcication(MedicationSchedule medication)
        {
            Create(medication);
        }

    }
}
