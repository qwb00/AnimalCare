using Shared.DataTransferObjects.MedicationsDTO;

namespace Service.Contracts
{
    public interface IMedicationService
    {
        Task<IEnumerable<MedicationScheduleDTO>> GetAllMedicationsAsync(bool trackChanges);
        Task<MedicationScheduleDTO> GetMedicationByIdAsync(Guid medicationId, bool trackChanges);
        Task<MedicationScheduleDTO> CreateMedicationAsync(MedicationScheduleForCreationDTO medication, bool trackChanges);
        Task UpdateMedicationAsync(Guid medicationId, MedicationScheduleForUpdateDTO medicationForUpdate, bool trackChanges);
        Task DeleteMedicationAsync(Guid medicationId, bool trackChanges);
    }
}
