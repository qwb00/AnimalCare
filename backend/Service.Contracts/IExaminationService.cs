// Service/Contracts/IExaminationService.cs
using Shared.DataTransferObjects;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Shared.DataTransferObjects.ExaminationRecordsDTO;

namespace Service.Contracts
{
    public interface IExaminationService
    {
        Task<IEnumerable<ExaminationRecordDto>> GetAllExaminationsAsync(bool trackChanges);
        Task<ExaminationRecordDto> GetExaminationByIdAsync(Guid examinationId, bool trackChanges);
        Task<ExaminationRecordDto> CreateExaminationAsync(ExaminationRecordForCreationDto examinationForCreation);
        Task UpdateExaminationAsync(Guid examinationId, ExaminationRecordForUpdateDto examinationForUpdate, bool trackChanges);
        Task DeleteExaminationAsync(Guid examinationId, bool trackChanges);
    }
}