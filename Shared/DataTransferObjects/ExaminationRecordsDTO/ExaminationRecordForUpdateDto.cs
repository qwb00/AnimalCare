using System.ComponentModel.DataAnnotations;
using Shared.Enums;

namespace Shared.DataTransferObjects.ExaminationRecordsDTO
{
    public class ExaminationRecordForUpdateDto
    {
        [Required]
        public ExaminationStatus Status { get; set; }

        [Required]
        public string FinalDiagnosis { get; set; }
    }
}