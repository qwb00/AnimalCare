namespace Models.Entities
{
    public class Volunteer : User
    {
        public bool IsVerified { get; set; }

        public ICollection<Reservation>? Reservations { get; set; } = new List<Reservation>();
        public ICollection<Animal>? Animals { get; set; } = new List<Animals>();
    }
}
