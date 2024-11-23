using System.ComponentModel.DataAnnotations;
using Shared.Enums;

namespace Shared.DataTransferObjects.ExaminationRecordsDTO
{
    public class ExaminationRecordForUpdateDto
    {
        public ExaminationStatus Status { get; set; }

        [StringLength(300, ErrorMessage = "Diagnosis cannot exceed 1000 characters.")]
        public string FinalDiagnosis { get; set; }
    }
}