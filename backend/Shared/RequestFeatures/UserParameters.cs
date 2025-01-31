namespace Shared.RequestFeatures
{
    public class UserParameters
    {
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Role { get; set; } // CareTaker, Veterinarian
        public string? Name { get; set; }
    }
}