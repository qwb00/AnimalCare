using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects;

/*
 * Sasha:
 *      Maybe need reservation show dto for a user to see reservations from reservation list
 *
 *      This dto for creating reservation request 
 */
public record ReservationRequestDto
{
    public Guid AnimalId { get; set; }
    public DateTime ReservationDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
}