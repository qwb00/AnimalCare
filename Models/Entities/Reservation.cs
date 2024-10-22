using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

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
        public Volunteer Volunteer { get; set; }

        [Required]
        public Guid AnimalId { get; set; }
        [ForeignKey("AnimalId")]
        [JsonIgnore]
        public Animal Animal { get; set; }
        
        /*
         * Sasha: 
         *      need checking (????).
         *      For a FE to color a reservation in a calendar
         *      if it was reserved but don't approved so user cannot reserve it again 
         */ 
        public bool isReserved { get; set; }
        // when was approved needed to be colored in a calendar in another color
        public bool isAproved { get; set; }
    }
}
