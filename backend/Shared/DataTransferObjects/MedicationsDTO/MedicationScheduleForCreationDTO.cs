using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects.MedicationsDTO
{
    public record MedicationScheduleForCreationDTO : MedicalScheduleForManipulationDTO
    {
        [Required]
        public Guid VeterinarianId { get; set; }
    }
}
