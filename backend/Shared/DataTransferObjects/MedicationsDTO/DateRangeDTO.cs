using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects.MedicationsDTO
{
    public record DateRangeDTO
    {
        [Required(ErrorMessage = "Start date is required.")]
        [DataType(DataType.Date, ErrorMessage = "Start date must be a valid date.")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "End date is required.")]
        [DataType(DataType.Date, ErrorMessage = "End date must be a valid date.")]
        [CustomValidation(typeof(DateRangeDTO), nameof(ValidateDateRange))]
        public DateTime EndDate { get; set; }

        public static ValidationResult ValidateDateRange(DateTime endDate, ValidationContext context)
        {
            var instance = (DateRangeDTO)context.ObjectInstance;
            if (instance.StartDate > endDate)
            {
                return new ValidationResult("End date must be after start date.");
            }
            return ValidationResult.Success;
        }
    }
}
