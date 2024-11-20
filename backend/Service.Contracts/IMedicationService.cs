using Shared.DataTransferObjects.MedicationsDTO;

namespace Service.Contracts
{
    public interface IMedicationService
    {
        Task<MedicationScheduleDTO> CreateMedicationAsync(Guid treatmentId, MedicationScheduleForCreationDTO medication, bool trackChanges);
        Task DeleteMedicationAsync(Guid medicationId, bool trackChanges);
    }
}
