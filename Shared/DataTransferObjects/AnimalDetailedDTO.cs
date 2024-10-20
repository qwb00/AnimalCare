using System.ComponentModel.DataAnnotations;
using Shared.DataTransferObjects.ExaminationRecordsDTO;
using Shared.DataTransferObjects.ReservationsDTO;

namespace Shared.DataTransferObjects;
using Shared.Enums;

// dto for a detailed animal page
public record AnimalDetailedDto : AnimalForCreating
{
    public List<ExaminationRecordDto> ExaminationRecords { get; set;}
    public List<ReservationForUserDto> Reservations { get; set;}
}