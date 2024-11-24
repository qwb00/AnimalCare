using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects.UsersDTO
{
    public record UserForUpdateDTO
    {
        [MaxLength(50, ErrorMessage = "Name is too long")]
        [RegularExpression(@"^[a-zA-Z\s\-]+$", ErrorMessage = "Name can only contain English letters, spaces, and hyphens.")]
        public string? FirstName { get; init; }

        [MaxLength(50, ErrorMessage = "Name is too long")]
        [RegularExpression(@"^[a-zA-Z\s\-]+$", ErrorMessage = "Name can only contain English letters, spaces, and hyphens.")]
        public string? LastName { get; init; }

        [EmailAddress(ErrorMessage = "Invalid email address format")]
        public string? Email { get; init; }

        [RegularExpression(@"^\+?\d{10,15}$", ErrorMessage = "Invalid phone number format. Must be from 10 to 15 digits")]
        public string? PhoneNumber { get; init; }
        public bool? isActive { get; set; }
    }
}
