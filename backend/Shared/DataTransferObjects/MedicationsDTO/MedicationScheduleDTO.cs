using Shared.Enums;
using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects.MedicationsDTO
{
    public record MedicationScheduleDTO
    {
        public Guid Id { get; set; }
        public string Drug { get; set; }
        public DaysOfWeek DaysOfWeek { get; set; }
        public int FrequencyInWeeks { get; set; }
        public int DailyDoseCount { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }
        public string FinalDiagnosis { get; set; }
        public string AnimalPhoto { get; set; }
        public string AnimalName { get; set; }
        public string AnimalBreed { get; set; }
    }
}
