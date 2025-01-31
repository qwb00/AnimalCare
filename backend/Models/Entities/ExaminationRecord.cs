using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shared.Enums;

namespace Models.Entities
{
    [Table("ExaminationRecord")]
    public class ExaminationRecord : BaseEntity
    {
        [Required]
        public string Description { get; set; }
        public ExaminationStatus Status { get; set; }
        
        public string FinalDiagnosis { get; set; }
		
        [Required]
		[DataType(DataType.DateTime)]
		public DateTime Date { get; set; } = DateTime.UtcNow;
        
        [Required]
        public ExaminationType Type { get; set; }

        [Required]
        public Guid AnimalId { get; set; }
        [ForeignKey("AnimalId")]
        public Animal Animal { get; set; }
        [Required]
        public Guid CareTakerId { get; set; }
        [ForeignKey("CareTakerId")]
        public CareTaker CareTaker { get; set; }
        [Required]
        public Guid VeterinarianId { get; set; }
        [ForeignKey("VeterinarianId")]
        public Veterinarian Veterinarian { get; set; }
    }
}
