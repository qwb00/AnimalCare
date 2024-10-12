
namespace Models.Entities
{
    public class CareTaker : User
    {
        public ICollection<ExaminationRecord>? Requests { get; set; } = new List<ExaminationRecord>();
    }
}
