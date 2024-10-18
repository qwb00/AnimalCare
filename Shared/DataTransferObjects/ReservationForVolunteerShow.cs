using Shared.Enums;

namespace Shared.DataTransferObjects;

public record ReservationForVolunteerShow
{   
    public string AnimalName { get; set; }
    public string AnimalBreed { get; set; }
    public ReservationStatus Status  { get; set; }
}