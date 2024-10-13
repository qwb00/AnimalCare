using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Entities
{
    public class ExaminationRecord : BaseEntity
    {
        public string? Text { get; set; }
        public string? Status { get; set; }
        public string? Notes { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public Guid AnimalId { get; set; }

        [ForeignKey("AnimalId")]
        public Animal Animal { get; set; } = null!;

        public Guid CareTakerId { get; set; }

        public CareTaker CareTaker { get; set; } = null!;
    }
}