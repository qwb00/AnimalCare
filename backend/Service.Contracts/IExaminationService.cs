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
        Task<IEnumerable<ExaminationRecordDetailDTO>> GetAllExaminationsAsync(bool trackChanges);
        Task<ExaminationRecordDetailDTO> GetExaminationByIdAsync(Guid examinationId, bool trackChanges);
        Task<ExaminationRecordDetailDTO> CreateExaminationAsync(ExaminationRecordForCreationDto examinationForCreation);
        Task UpdateExaminationAsync(Guid examinationId, ExaminationRecordForUpdateDto examinationForUpdate, bool trackChanges);
        Task<(ExaminationRecordForUpdateDto examinationForPatch, ExaminationRecord examinationEntity)> GetExaminationForPatchAsync(Guid id);
        Task SaveChangesForPatchAsync(ExaminationRecordForUpdateDto patch, ExaminationRecord examination);
        Task DeleteExaminationAsync(Guid examinationId, bool trackChanges);
    }
}