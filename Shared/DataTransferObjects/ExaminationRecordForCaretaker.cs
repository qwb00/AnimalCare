using Shared.Enums;

namespace Shared.DataTransferObjects;

public record ExaminationRecordForCaretaker : ExaminationRecordForCreating
{
    public ExaminationStatus Status { get; init; }
}