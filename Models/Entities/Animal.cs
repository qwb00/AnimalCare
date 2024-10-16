
using System.ComponentModel.DataAnnotations;

namespace Models.Entities
{
    public class Animal : BaseEntity
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; }
        public string Species { get; set; }
        public string Breed { get; set; }
        public int Age { get; set; }

        [MaxLength(500)]
        [Url]
        public string Photo { get; set; }
        public string History { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime DateFound { get; set; }

        public string Type { get; set; }

        public ICollection<Reservation> Reservations { get; set; }
        public ICollection<ExaminationRecord> Examinations { get; set; }
    }
}
