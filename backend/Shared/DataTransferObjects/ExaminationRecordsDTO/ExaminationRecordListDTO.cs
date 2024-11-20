using Shared.Enums;

namespace Shared.DataTransferObjects.ExaminationRecordsDTO
{
    public record ExaminationRecordListDTO
    {
        public Guid Id { get; set; }
        public string AnimalName { get; set; }
        public string AnimalBreed { get; set; }
        public string VeterinarianName { get; set; }
        public ExaminationType Type { get; set; }
        public ExaminationStatus Status { get; set; }
        public DateTime ExaminationDate { get; set; }
        public string AnimalPhoto { get; set; }
    }
}
