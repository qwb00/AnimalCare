using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Entities
{
    public class HealthRecord : BaseEntity
    {
        public string Notes { get; set; }
        public string Type { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime Date { get; set; }
        public Guid AnimalId { get; set; }
        public Animal Animal { get; set; }
        public Guid VeterinarianId { get; set; }
        public Veterinarian Veterinarian { get; set; }
    }
}
