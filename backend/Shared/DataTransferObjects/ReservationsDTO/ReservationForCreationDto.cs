using System.ComponentModel.DataAnnotations;

/*
 * Sasha:
 *      Maybe need reservation show dto for a user to see reservations from reservation list
 *
 *      This dto for creating reservation request 
 */
namespace Shared.DataTransferObjects.ReservationsDTO
{
    public class ReservationForCreationDto
    {
        [Required(ErrorMessage = "Please select an animal.")]
        public Guid AnimalId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required(ErrorMessage = "Reservation date is required.")]
        [DataType(DataType.Date, ErrorMessage = "Reservation date must be a valid date.")]
        [CustomValidation(typeof(ReservationForCreationDto), nameof(ValidateReservationDate))]
        public DateTime ReservationDate { get; set; }

        [Required(ErrorMessage = "Start time is required.")]
        [DataType(DataType.Time, ErrorMessage = "Start time must be a valid time.")]
        public TimeSpan StartTime { get; set; }

        [Required(ErrorMessage = "End time is required.")]
        [DataType(DataType.Time, ErrorMessage = "End time must be a valid time.")]
        [CustomValidation(typeof(ReservationForCreationDto), nameof(ValidateTimeRange))]
        public TimeSpan EndTime { get; set; }

        private static ValidationResult ValidateReservationDate(DateTime reservationDate, ValidationContext context)
        {
            if (reservationDate < DateTime.UtcNow.Date)
            {
                return new ValidationResult("Reservation date cannot be in the past.");
            }
            return ValidationResult.Success;
        }

        // Custom Validation for Time Range
        private static ValidationResult ValidateTimeRange(TimeSpan endTime, ValidationContext context)
        {
            var instance = (ReservationForCreationDto)context.ObjectInstance;
            if (instance.StartTime >= endTime)
            {
                return new ValidationResult("End time must be after start time.");
            }
            return ValidationResult.Success;
        }
    }
}