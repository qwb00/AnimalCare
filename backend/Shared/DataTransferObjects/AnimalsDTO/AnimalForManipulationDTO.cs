using System.ComponentModel.DataAnnotations;
using Shared.Enums;

namespace Shared.DataTransferObjects.AnimalsDTO
{
    public abstract record AnimalForManipulationDTO
    {
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
        [RegularExpression(@"^[a-zA-Z\s\-]+$", ErrorMessage = "Name can only contain English letters, spaces, and hyphens.")]
        public string Name { get; init; }

        [Required(ErrorMessage = "Breed is required.")]
        [StringLength(100, ErrorMessage = "Breed cannot exceed 100 characters.")]
        [RegularExpression(@"^[a-zA-Z\s\-]+$", ErrorMessage = "Breed can only contain English letters, spaces, and hyphens.")]
        public string Breed { get; init; }

        [Range(0, 25, ErrorMessage = "Age must be between 0 and 30.")]
        public int Age { get; init; }

        [MaxLength(500, ErrorMessage = "Photo URL cannot exceed 500 characters.")]
        [Url(ErrorMessage = "Photo must be a valid URL.")]
        public string? Photo { get; set; }

        [Range(0, 30, ErrorMessage = "Weight must be between 0 and 30.")]
        public string? Weight { get; set; }

        // Enums Attributes
        [Required(ErrorMessage = "Sex is required.")]
        [EnumDataType(typeof(Sex), ErrorMessage = "Invalid sex type.")]
        public Sex Sex { get; set; }

        [EnumDataType(typeof(Size), ErrorMessage = "Invalid size type.")]
        public Size Size { get; set; }

        [EnumDataType(typeof(Health), ErrorMessage = "Invalid health type.")]
        public Health Health { get; set; }

        [Required(ErrorMessage = "Species is required.")]
        [EnumDataType(typeof(Species), ErrorMessage = "Invalid species type.")]
        public Species Species { get; set; }

        [MaxLength(1000, ErrorMessage = "History cannot exceed 1000 characters.")]
        public string? History { get; set; }

        [MaxLength(500, ErrorMessage = "Personality description cannot exceed 500 characters.")]
        public string? Personality { get; set; }

        [DataType(DataType.Date)]
        [CustomValidation(typeof(AnimalForManipulationDTO), nameof(ValidateDateFound))]
        public DateTime? DateFound { get; set; }

        private static ValidationResult ValidateDateFound(DateTime dateFound, ValidationContext context)
        {
            if (dateFound > DateTime.UtcNow)
            {
                return new ValidationResult("Date found cannot be in the future.");
            }
            return ValidationResult.Success;
        }
    }
}
