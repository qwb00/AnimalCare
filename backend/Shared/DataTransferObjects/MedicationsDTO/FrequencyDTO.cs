using Shared.Enums;
using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects.MedicationsDTO
{
    public class FrequencyDTO
    {
        [Range(1, 24, ErrorMessage = "Frequency value must be between 1 and 24.")]
        public int Count { get; set; }

        [EnumDataType(typeof(Unit), ErrorMessage = "Invalid unit type.")]
        public Unit Unit { get; set; } 
    }
}
