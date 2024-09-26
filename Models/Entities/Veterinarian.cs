using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Entities
{
    public class Veterinarian : User
    {
        public string Specialization { get; set; }
        public ICollection<Request>? Requests { get; set; } = new List<Request>();
        public ICollection<HealthRecord>? Records { get; set; } = new List<HealthRecord>();

    }
}
