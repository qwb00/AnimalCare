using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects.UsersDTO
{
    public abstract record UserForManipulationDTO
    {
        [Required(ErrorMessage = "First name is required")]
        [MaxLength(50, ErrorMessage = "Name is too long")]
        [RegularExpression(@"^[a-zA-Z\s\-]+$", ErrorMessage = "Name can only contain English letters, spaces, and hyphens.")]
        public string FirstName { get; init; }

        [Required(ErrorMessage = "Last name is required")]
        [MaxLength(50, ErrorMessage = "Name is too long")]
        [RegularExpression(@"^[a-zA-Z\s\-]+$", ErrorMessage = "Name can only contain English letters, spaces, and hyphens.")]
        public string LastName { get; init; }

        [Required(ErrorMessage = "Username is required")]
        public string Username { get; init; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address format")]
        public string Email { get; init; }

        [Required(ErrorMessage = "Phone number is required")]
        [RegularExpression(@"^\+?\d{10,15}$", ErrorMessage = "Invalid phone number format. Must be from 10 to 15 digits")]
        public string PhoneNumber { get; init; }
        public ICollection<string>? Roles { get; init; }

        [MaxLength(500, ErrorMessage = "Photo URL cannot exceed 500 characters.")]
        [Url(ErrorMessage = "Photo must be a valid URL.")]
        public string? Photo { get; set; }
    }
}
