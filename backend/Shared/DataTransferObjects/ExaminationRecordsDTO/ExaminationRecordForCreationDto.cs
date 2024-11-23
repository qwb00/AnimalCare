// Shared/DataTransferObjects/ExaminationRecordForCreationDto.cs
using System;
using System.ComponentModel.DataAnnotations;
using Shared.Enums;

namespace Shared.DataTransferObjects.ExaminationRecordsDTO
{
    public class ExaminationRecordForCreationDto
    {
        [Required(ErrorMessage = "Please select an animal.")]
        public Guid AnimalId { get; set; }

        [Required(ErrorMessage = "Please select a veterinarian.")]
        public Guid VeterinarianId { get; set; }

        // automatically generated
        public Guid CareTakerId { get; set; }

        [Required(ErrorMessage = "Examination date is required.")]
        [DataType(DataType.Date)]
        public DateTime ExaminationDate { get; set; }

        [Required(ErrorMessage = "Examination type is required.")]
        [EnumDataType(typeof(ExaminationType), ErrorMessage = "Invalid examination type.")]
        public ExaminationType Type { get; set; }

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters.")]
        public string Description { get; set; }
    }
}