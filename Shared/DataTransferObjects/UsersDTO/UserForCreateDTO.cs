
using Shared.Enums;
using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects.UsersDTO
{
    public record UserForCreateDTO
    {
        public string? FirstName { get; init; }
        public string? LastName { get; init; }

        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; init; }
        public string? Email { get; init; }
        public string? PhoneNumber { get; init; }
        public ICollection<string>? Roles { get; init; }
    }
}
