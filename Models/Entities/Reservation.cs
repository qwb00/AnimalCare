using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Entities
{
    public class Reservation : BaseEntity
    {
        [DataType(DataType.DateTime)]
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsEnded { get; set; }
     
        [Required]
        public Guid VolunteerId { get; set; }

        [ForeignKey("VolunteerId")]
        public Volunteer? Volunteer { get; set; }

        [Required]
        public Guid AnimalId { get; set; }
        public Animal? Animal { get; set; }
    }
}
