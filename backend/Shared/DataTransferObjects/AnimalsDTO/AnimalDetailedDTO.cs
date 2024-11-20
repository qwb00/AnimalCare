using System.ComponentModel.DataAnnotations;
using Shared.DataTransferObjects.ExaminationRecordsDTO;
using Shared.DataTransferObjects.ReservationsDTO;

namespace Shared.DataTransferObjects.AnimalsDTO;

// dto for a detailed animal page
public record AnimalDetailedDto : AnimalForCreating
{
    public Guid Id { get; set; }
    public List<ExaminationRecordDetailDTO> ExaminationRecords { get; set;}
    public List<ReservationForUserDto> Reservations { get; set;}
}