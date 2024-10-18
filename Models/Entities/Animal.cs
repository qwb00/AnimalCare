
using System.ComponentModel.DataAnnotations;
using Shared.Enums;
namespace Models.Entities
{
    public class Animal : BaseEntity
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; }
        public string Breed { get; set; }
        public int Age { get; set; }
		public string Weight { get; set; }
		
		// Enums Atributes
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

        public ICollection<Reservation> Reservations { get; set; }
        public ICollection<ExaminationRecord> Examinations { get; set; }
    }
}
