// Shared/DataTransferObjects/ReservationForConfirmationDto.cs

using System.ComponentModel.DataAnnotations;
using Shared.Enums;

namespace Shared.DataTransferObjects.ReservationsDTO
{
    public class ReservationForConfirmationDto
    {
        public Guid Id { get; set; }
        public string VolunteerName { get; set; }
        public Guid VolunteerId { get; set; }
        public string AnimalName { get; set; }
        public Guid AnimalId { get; set; }
        public string AnimalBreed { get; set; }
        public DateTime ReservationDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string Photo { get; set; }
        public ReservationStatus Status { get; set; }
    }
}