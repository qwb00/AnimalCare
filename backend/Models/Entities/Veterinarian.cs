namespace Models.Entities
{
    public class Veterinarian : User
    {
        public ICollection<ExaminationRecord>? Requests { get; set; } = new List<ExaminationRecord>();
        public ICollection<MedicationSchedule>? Medications {  get; set; }
    }
}
