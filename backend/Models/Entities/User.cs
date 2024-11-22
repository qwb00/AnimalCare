using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Entities
{
    public class User : IdentityUser<Guid>
    {
        [Required]
        [MaxLength(150)]
        public string FullName { get; set; }
        [Url]
        public string? Photo { get; set; }
        public ICollection<Reservation>? Reservations { get; set; } = new List<Reservation>();
    }
}
