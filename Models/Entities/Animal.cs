
using System.ComponentModel.DataAnnotations;

namespace Models.Entities
{
    public class Animal : BaseEntity
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; }
        public string Species { get; set; }
        public int Age { get; set; }

        [MaxLength(500)]
        [Url]
        public string Photo { get; set; }
        public string History { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime DateFound { get; set; }
        public ICollection<HealthRecord> HealthRecords { get; set; }
        public ICollection<WalkSchedule> WalkSchedules { get; set; }
    }
}
