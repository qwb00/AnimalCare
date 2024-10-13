namespace Models.Entities
{
    public class Volunteer : User
    {
        public new bool IsVerified { get; set; }

        public ICollection<Reservation>? Reservations { get; set; } = new List<Reservation>();
    }
}
