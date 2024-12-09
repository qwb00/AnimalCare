namespace Shared.RequestFeatures;

public class ReservationParameters
{
    public string? AnimalName { get; set; }
    public string? Breed { get; set; }
    public string? VolunteerName { get; set; }
    public string? VolunteerPhoneNumber { get; set; }
    public DateTime? Date { get; set; }
    public TimeSpan? StartTime { get; set; }
    public TimeSpan? EndTime { get; set; }
}