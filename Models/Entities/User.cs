using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Entities
{
    public class User : IdentityUser
    {
        [Required]
        [MaxLength(150)]
        public string FullName { get; set; }

    }
}
