using Shared.Enums;
using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects.MedicationsDTO
{
    public abstract record MedicalScheduleForManipulationDTO
    {
        public string Drug { get; set; }
        public DateRangeDTO DateRange {  get; set; }
        public FrequencyDTO Frequency { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }

        [MaxLength(300)]
        public string Diagnosis { get; set; }
    }
}
