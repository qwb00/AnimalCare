// Shared/DataTransferObjects/ExaminationRecordForCreationDto.cs
using System;
using System.ComponentModel.DataAnnotations;
using Shared.Enums;

namespace Shared.DataTransferObjects.ExaminationRecordsDTO
{
    public class ExaminationRecordForCreationDto
    {
        [Required]
        public Guid AnimalId { get; set; }

        [Required]
        public Guid VeterinarianId { get; set; }

        [Required]
        public Guid CareTakerId { get; set; }
        
        [Required]
        [DataType(DataType.Date)]
        public DateTime ExaminationDate { get; set; }

        [Required]
        public ExaminationType Type { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public ExaminationStatus Status { get; set; }
    }
}