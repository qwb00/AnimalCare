using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Entities
{
    public class CareTaker : User
    {
        public ICollection<Reservation>? Reservations { get; set; } = new List<Reservation>();
        public ICollection<Request>? Requests { get; set; } = new List<Request>();
    }
}
