using System.ComponentModel.DataAnnotations;
using Shared.DataTransferObjects.ReservationsDTO;

namespace Shared.DataTransferObjects;
using Shared.Enums;

// dto for a detailed animal page
public record AnimalDetailedDto : AnimalForCreating
{
    public List<ExaminationRecordForCaretaker> ExaminationRecords { get; set;}
    public List<ReservationForUserDto> Reservations { get; set;}
}