using System.ComponentModel.DataAnnotations;
using Shared.Enums;

namespace Shared.DataTransferObjects.ExaminationRecordsDTO
{
    public class ExaminationRecordForUpdateDto
    {
        public ExaminationStatus Status { get; set; }

        [StringLength(30, ErrorMessage = "Diagnosis cannot exceed 30 characters.")]
        public string FinalDiagnosis { get; set; }
    }
}