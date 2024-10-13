using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Models.Entities
{
    public class User : IdentityUser<Guid>
    {
        [Required]
        [MaxLength(150)]
        public string FullName { get; set; }

        [Required]
        public override string? Email { get; set; }

        [Required]
        public override string? PasswordHash { get; set; }

        [Required]
        public override string? PhoneNumber { get; set; }

        [Required]
        public bool IsVerified { get; set; }

        [Required]
        public string Role { get; set; }

        public User()
        {
            FullName = default!;
            Email = default!;
            PasswordHash = default!;
            PhoneNumber = default!;
            Role = default!;
        }
    }
}
