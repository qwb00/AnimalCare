using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Entities
{
    public class Request : BaseEntity
    {
        public string Text { get; set; }
        public string Status { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid AnimalId { get; set; }
        public Animal Animal { get; set; }
        public Guid CaretakerId { get; set; }
        public CareTaker CareTaker { get; set; }
        public Guid VeterinarianId { get; set; }
        public Veterinarian Veterinarian { get; set; }


    }
}
