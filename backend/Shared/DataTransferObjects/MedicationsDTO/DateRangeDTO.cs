namespace Shared.DataTransferObjects.MedicationsDTO
{
    public record DateRangeDTO
    {
        public DateTime StartDate { get; set; } 
        public DateTime EndDate { get; set; }
    }
}
