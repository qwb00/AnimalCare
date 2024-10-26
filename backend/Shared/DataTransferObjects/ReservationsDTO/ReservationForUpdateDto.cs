// Shared/DataTransferObjects/ReservationForUpdateDTO.cs

using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects.ReservationsDTO
{
    public class ReservationForUpdateDto
    {
        [DataType(DataType.DateTime)]
        public DateTime Date { get; set; }
        [DataType(DataType.Time)]
        public TimeSpan StartTime { get; set; }
        [DataType(DataType.Time)]
        public TimeSpan EndTime { get; set; }

        public bool IsEnded { get; set; }
        public bool IsReserved { get; set; }
        public bool IsApproved { get; set; }
    }
}