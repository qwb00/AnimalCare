using Shared.Enums;

namespace Models.Entities
{
    public class Volunteer : User
    {
        public bool IsVerified { get; set; }
        public VolunteerStatus VolunteerStatus { get; set; }
    }
}
