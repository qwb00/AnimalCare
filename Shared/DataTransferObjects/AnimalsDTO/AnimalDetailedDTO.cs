using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects.AnimalsDTO;

// dto for a detailed animal page
public record AnimalDetailedDto : AnimalForCreating
{
    public List<ExaminationRecordForCaretaker> ExaminationRecords { get; set; }
    public List<ReservationForVolunteerShow> Reservations { get; set; }
}