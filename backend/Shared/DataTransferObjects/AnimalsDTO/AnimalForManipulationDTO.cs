using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DataTransferObjects.AnimalsDTO
{
    public abstract record AnimalForManipulationDTO
    {
        public string Name { get; init; }
        public string Breed { get; init; }
        public int Age { get; init; }

        [MaxLength(500)]
        [Url]
        public string Photo { get; set; }
        public string Weight { get; set; }

        // Enums Attributes
        public Sex Sex { get; set; }
        public Size Size { get; set; }
        public Health Health { get; set; }
        public Species Species { get; set; }
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
}
