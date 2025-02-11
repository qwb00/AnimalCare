using Shared.Enums;

namespace Shared.DataTransferObjects.ReservationsDTO
{
    public class ReservationForUserDTO
    {
        public Guid Id { get; set; }
        public Guid AnimalId { get; set; }
        public string AnimalName { get; set; }
        public string AnimalBreed { get; set; }
        public ReservationStatus Status { get; set; }
        
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }
}