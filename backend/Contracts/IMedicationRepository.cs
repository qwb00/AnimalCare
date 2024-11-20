using Models.Entities;

namespace Contracts
{
    public interface IMedicationRepository: IRepository<MedicationSchedule>
    {
        void CreateMedcicationForTreatment(Guid treatmentId, MedicationSchedule medication);
    }
}
