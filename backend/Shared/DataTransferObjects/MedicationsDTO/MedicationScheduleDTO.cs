using Shared.Enums;
using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects.MedicationsDTO
{
    public record MedicationScheduleDTO
    {
        public Guid Id { get; set; }
        public string Drug { get; set; }
        public int Count { get; set; }
        public Unit Unit { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }
        public string Diagnosis { get; set; }
        public string AnimalPhoto { get; set; }
        public string AnimalName { get; set; }
        public string AnimalBreed { get; set; }
    }
}
