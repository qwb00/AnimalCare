
using System.ComponentModel.DataAnnotations;

namespace Models.Entities
{
    public class Animal : BaseEntity
    {
        [Required]
        [MaxLength(150)]
        public string? Name { get; set; }
        public string? Species { get; set; }
        public int Age { get; set; }

        [MaxLength(500)]
        [Url]
        public string? Photo { get; set; }
        public string? History { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime DateFound { get; set; }

        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
        public ICollection<ExaminationRecord> Examinations { get; set; } = new List<ExaminationRecord>();

        // New attribute
        public string? Type { get; set; }

        public string? Breed { get; set; }
    }
}
