using System.ComponentModel.DataAnnotations;
using Shared.Enums;

namespace Shared.DataTransferObjects.AnimalsDTO;

public record AnimalForCreating : AnimalForCardsDto
{
    public string Weight { get; set; }

    // Enums Attributes
    public Sex Sex { get; set; }
    public Size Size { get; set; }
    public Health Health { get; set; }
    public Species Species { get; set; }

    [MaxLength(500)]
    [Url]
    public string Photo { get; set; }
    public string History { get; set; }
    // need checking (????)
    public string Personality { get; set; }

    // Medical data
    public bool IsVaccinated { get; set; }
    public bool IsSterilized { get; set; }
    public bool IsChipped { get; set; }
    public DateTime LastExamination { get; set; }

    // Behaviour 
    public bool IsPeopleFriendly { get; set; }
    public bool IsAnimalFriendly { get; set; }
    public bool IsCommandsTaught { get; set; }
    public bool IsLeashTrained { get; set; }

    [DataType(DataType.DateTime)]
    public DateTime DateFound { get; set; }
}