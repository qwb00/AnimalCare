using Shared.Enums;

namespace Shared.DataTransferObjects;

public record UserForChangingRole
{
    public string Email { get; init; }
    public Role Role { get; init; }
    public string PhoneNumber { get; init; }
    public string Name { get; init; }
}