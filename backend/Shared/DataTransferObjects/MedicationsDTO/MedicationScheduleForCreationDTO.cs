using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects.MedicationsDTO
{
    public record MedicationScheduleForCreationDTO : MedicalScheduleForManipulationDTO
    {
        [Required(ErrorMessage = "Please select a veterinarian.")]
        public Guid VeterinarianId { get; set; }

        [Required(ErrorMessage = "Please select an animal.")]
        public Guid AnimalId { get; set; }
    }
}
