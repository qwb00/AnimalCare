using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects;

// Dto for animal cards
public record AnimalForCardsDto
{   
    public string Name { get; init; }
    public string Breed { get; init; }
    public int Age { get; init; }
    
    [MaxLength(500)]
    [Url]
    public string Photo { get; set; }
}