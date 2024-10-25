using Shared.Enums;

namespace Shared.DataTransferObjects.ReservationsDTO
{
    public class ReservationForUserDto
    {
        public Guid Id { get; set; }
        public string AnimalName { get; set; }
        public string AnimalBreed { get; set; }
        public ReservationStatus Status { get; set; }
    }
}