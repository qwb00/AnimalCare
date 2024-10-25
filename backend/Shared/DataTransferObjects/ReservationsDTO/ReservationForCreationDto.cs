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
        [Required]
        public Guid AnimalId { get; set; }

        [Required]
        public Guid VolunteerId { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime ReservationDate { get; set; }

        [Required]
        [DataType(DataType.Time)]
        public TimeSpan StartTime { get; set; }

        [Required]
        [DataType(DataType.Time)]
        public TimeSpan EndTime { get; set; }
    }
}