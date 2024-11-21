using Models.Entities;
using System.Linq.Expressions;

namespace Contracts
{
    public interface IMedicationRepository: IRepository<MedicationSchedule>
    {
        Task<IEnumerable<MedicationSchedule>> GetAllMedicationsAsync(bool trackChanges);
        Task<MedicationSchedule> GetMedicationByIdAsync(Guid medicationId, bool trackChanges);
        void CreateMedcication(MedicationSchedule medication);
    }
}
