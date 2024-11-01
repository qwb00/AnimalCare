using System.ComponentModel.DataAnnotations;
using Shared.Enums;

namespace Shared.DataTransferObjects.UsersDTO;

public record UserDetailDTO : IRole
{
    public Guid Id { get; init; }
    public string Name { get; init; }
    public string Email { get; init; }
    public string PhoneNumber { get; init; }
    public string Role { get; set; }
    public DateTime RegistrationDate { get; init; }
    
    [Url]
    public string? Photo { get; set; }
}