using Shared.Enums;

namespace Shared.DataTransferObjects;

public record ExaminationRecordForCreating
{
    public int ID { get; init; }
    public string AnimalName { get; init; }
    public string AnimalBreed { get; init; }
    public DateTime Date { get; init; }
    public ExaminationType Type { get; init; }
    public string Description { get; init; }
}