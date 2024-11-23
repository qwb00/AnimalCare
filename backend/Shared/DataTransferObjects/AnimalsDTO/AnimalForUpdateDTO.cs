using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DataTransferObjects.AnimalsDTO
{
    public record AnimalForUpdateDTO : AnimalForManipulationDTO
    {
        // Medical data
        public bool IsVaccinated { get; set; }

        public bool IsSterilized { get; set; }

        public bool IsChipped { get; set; }

        [DataType(DataType.Date)]
        public DateTime LastExamination { get; set; }

        // Behaviour 
        public bool IsPeopleFriendly { get; set; }

        public bool IsAnimalFriendly { get; set; }

        public bool IsCommandsTaught { get; set; }

        public bool IsLeashTrained { get; set; }
    }
}
