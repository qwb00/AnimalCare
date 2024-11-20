using Contracts;
using Models.Entities;

namespace Repositories
{
    public class MedicationRepository : RepositoryBase<MedicationSchedule>, IMedicationRepository
    {
        public MedicationRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }
        public void CreateMedcicationForTreatment(Guid treatmentId, MedicationSchedule medication)
        {
            medication.ExaminationRecordId = treatmentId;
            Create(medication);
        }

    }
}
