using System.ComponentModel.DataAnnotations;
using Shared.Enums;

namespace Shared.DataTransferObjects.AnimalsDTO;

public record AnimalForHealthRecord : AnimalForCardsDto
{
    // Enums Attributes
    public Sex Sex { get; set; }
    public Species Species { get; set; }

    [MaxLength(500)]
    [Url]
    public string Photo { get; set; }

    // Medical data
    public bool IsVaccinated { get; set; }
    public bool IsSterilized { get; set; }
    public bool IsChipped { get; set; }
    public DateTime LastExamination { get; set; }

    public string Notes { get; set; }
}