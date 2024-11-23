using System.ComponentModel.DataAnnotations;
using Shared.Enums;

namespace Shared.DataTransferObjects.ExaminationRecordsDTO
{
    public class ExaminationRecordForUpdateDto
    {
        public ExaminationStatus Status { get; set; }

        public string FinalDiagnosis { get; set; }
    }
}