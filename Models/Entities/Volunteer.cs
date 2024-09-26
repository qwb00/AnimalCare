namespace Models.Entities
{
    public class Volunteer : User
    {
        public bool IsVerified { get; set; }

        public ICollection<Reservation>? Reservations { get; set; } = new List<Reservation>();
    }
}
