// Shared/DataTransferObjects/ExaminationRecordForCreationDto.cs
using System;
using System.ComponentModel.DataAnnotations;
using Shared.DataTransferObjects.ReservationsDTO;
using Shared.Enums;

namespace Shared.DataTransferObjects.ExaminationRecordsDTO
{
    public class ExaminationRecordForCreationDTO
    {
        [Required(ErrorMessage = "Please select an animal.")]
        public Guid AnimalId { get; set; }

        [Required(ErrorMessage = "Please select a veterinarian.")]
        public Guid VeterinarianId { get; set; }

        // automatically generated
        [Required]
        public Guid CareTakerId { get; set; }

        [Required(ErrorMessage = "Examination date is required.")]
        [CustomValidation(typeof(ExaminationRecordForCreationDTO), nameof(ValidateExaminationDate))]
        [DataType(DataType.Date, ErrorMessage = "Examination date must be a valid date.")]
        public DateTime ExaminationDate { get; set; }

        [Required(ErrorMessage = "Examination type is required.")]
        [EnumDataType(typeof(ExaminationType), ErrorMessage = "Invalid examination type.")]
        public ExaminationType Type { get; set; }

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters.")]
        public string Description { get; set; }

        public static ValidationResult ValidateExaminationDate(DateTime exminationDate, ValidationContext context)
        {
            if (exminationDate < DateTime.UtcNow.Date)
            {
                return new ValidationResult("Examination date cannot be in the past.");
            }
            return ValidationResult.Success;
        }
    }
}