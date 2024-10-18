using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects;

public record ReservationForAccepting
{
    public int Id { get; init; }
    public string VolunteerName { get; init; }
    public string AnimalName { get; init; }
    public string AnimalBreed { get; init; }
    public DateTime Date { get; init; }
    public string Time { get; init; }
    
    [MaxLength(500)]
    [Url]
    public string Photo { get; set; }
}