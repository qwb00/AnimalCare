// Service/Contracts/IExaminationService.cs
using Shared.DataTransferObjects;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Shared.DataTransferObjects.ExaminationRecordsDTO;
using Models.Entities;

namespace Service.Contracts
{
    public interface IExaminationService
    {
        Task<IEnumerable<ExaminationRecordDto>> GetAllExaminationsAsync(bool trackChanges);
        Task<ExaminationRecordDto> GetExaminationByIdAsync(Guid examinationId, bool trackChanges);
        Task<ExaminationRecordDto> CreateExaminationAsync(ExaminationRecordForCreationDto examinationForCreation);
        Task UpdateExaminationAsync(Guid examinationId, ExaminationRecordForUpdateDto examinationForUpdate, bool trackChanges);
        Task<(ExaminationRecordForUpdateDto examinationForPatch, ExaminationRecord examinationEntity)> GetExaminationForPatchAsync(Guid id);
        Task SaveChangesForPatchAsync(ExaminationRecordForUpdateDto patch, ExaminationRecord examination);
        Task DeleteExaminationAsync(Guid examinationId, bool trackChanges);
    }
}