using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Entities
{
    public class Reservation : BaseEntity
    {
        [DataType(DataType.DateTime)]
        public DateTime ReservedAt { get; set; } 
        public bool IsEnded { get; set; }
        public Guid CareTakerId { get; set; }

        [ForeignKey("CareTakerId")]
        public CareTaker? CareTaker { get; set; }
        [Required]
        public Guid VolunteerId { get; set; }

        [ForeignKey("VolunteerId")]
        public Volunteer Volunteer { get; set; }
        public Guid WalkScheduleId { get; set; }

        [ForeignKey("WalkScheduleId")]
        public WalkSchedule WalkSchedule { get; set; }
    }
}
