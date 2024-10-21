using Shared.Enums;

namespace Shared.DataTransferObjects.UsersDTO
{
    public record UserListDTO
    {
        public string Name { get; init; }
        public string Email { get; init; }
        public string PhoneNumber { get; init; }
        public Role Role { get; init; }
    }
}
