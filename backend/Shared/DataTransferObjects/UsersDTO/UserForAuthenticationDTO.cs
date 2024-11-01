using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects.UsersDTO
{
    public record UserForAuthenticationDTO
    {
        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; init; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address format")]
        public string? Email { get; init; }
    }
}
