using Shared.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Entities
{
    public class MedicationSchedule : BaseEntity
    {
        public string Drug {  get; set; }
        public DaysOfWeek DaysOfWeek { get; set; }
        public int FrequencyInWeeks { get; set; }
        public int DailyDoseCount { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }

        [Required]
        public Guid VeterinarianId { get; set; }

        [ForeignKey("VeterinarianId")]
        public Veterinarian Veterinarian { get; set; }
    }
}
