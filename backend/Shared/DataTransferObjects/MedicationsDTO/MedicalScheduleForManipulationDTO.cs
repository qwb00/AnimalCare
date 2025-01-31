using System;
using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects.MedicationsDTO
{
    public abstract record MedicalScheduleForManipulationDTO
    {
        [Required(ErrorMessage = "Drug is required.")]
        [MaxLength(200, ErrorMessage = "Drug name cannot exceed 200 characters.")]
        public string Drug { get; set; }

        [Required(ErrorMessage = "Date range is required.")]
        public DateRangeDTO DateRange {  get; set; }
        public FrequencyDTO Frequency { get; set; }

        [MaxLength(1000, ErrorMessage = "Description cannot exceed 1000 characters.")]
        public string Description { get; set; }

        [MaxLength(300, ErrorMessage = "Diagnosis cannot exceed 300 characters.")]
        public string Diagnosis { get; set; }
    }
}
