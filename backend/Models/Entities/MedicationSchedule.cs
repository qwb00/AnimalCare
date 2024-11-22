using Shared.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Entities
{
    public class MedicationSchedule : BaseEntity
    {
        public string Drug {  get; set; }
        public int Count { get; set; }
        public Unit Unit { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }
        [MaxLength(300)]
        public string Diagnosis { get; set; }

        [Required]
        public Guid VeterinarianId { get; set; }

        [ForeignKey("VeterinarianId")]
        public Veterinarian Veterinarian { get; set; }

        [Required]
        public Guid AnimalId { get; set; }
        [ForeignKey("AnimalId")]
        public Animal Animal { get; set; }
    }
}
