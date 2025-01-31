// Shared/DataTransferObjects/ReservationForUpdateDTO.cs

using System.ComponentModel.DataAnnotations;
using Shared.Enums;

namespace Shared.DataTransferObjects.ReservationsDTO
{
    public class ReservationForUpdateDTO
    {
        [DataType(DataType.DateTime)]
        public DateTime Date { get; set; }
        [DataType(DataType.Time)]
        public TimeSpan StartTime { get; set; }
        [DataType(DataType.Time)]
        public TimeSpan EndTime { get; set; }
        
        public ReservationStatus Status { get; set; }
    }
}