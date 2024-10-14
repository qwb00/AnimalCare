using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Entities
{
    [Table("ExaminationRecord")]
    public class ExaminationRecord : BaseEntity
    {
        public string Text { get; set; }
        public string Status { get; set; }

        public string Notes { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public Guid AnimalId { get; set; }
        [ForeignKey("AnimalId")]
        public Animal Animal { get; set; }
        public Guid CareTakerId { get; set; }
        [ForeignKey("CareTakerId")]
        public CareTaker CareTaker { get; set; }
        public Guid VeterinarianId { get; set; }
        [ForeignKey("VeterinarianId")]
        public Veterinarian Veterinarian { get; set; }
    }
}
