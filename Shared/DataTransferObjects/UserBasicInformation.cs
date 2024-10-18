using Shared.Enums;

namespace Shared.DataTransferObjects;

public record UserBasicInformation
{
    public string Name { get; init; }
    public string Email { get; init; }
    public string PhoneNumber { get; init; }
    public Role Role { get; init; }
    public DateTime RegistrationDate { get; init; }
    public string Password { get; init; }
}