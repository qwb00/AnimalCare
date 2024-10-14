using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Entities
{
    public class Veterinarian : User
    {
        public ICollection<ExaminationRecord>? Requests { get; set; } = new List<ExaminationRecord>();
    }
}
