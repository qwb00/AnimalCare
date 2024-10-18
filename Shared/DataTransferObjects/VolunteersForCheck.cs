using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects;

public record VolunteersForCheck
{
    public string Name { get; init; }
    public string Email { get; init; }
    public string PhoneNumber { get; init; }
    
    [MaxLength(500)]
    [Url]
    public string Photo { get; set; }
}