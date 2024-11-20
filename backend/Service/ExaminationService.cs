using AutoMapper;
using Contracts;
using Models.Entities;
using Service.Contracts;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.ExaminationRecordsDTO;

namespace Service
{
    public class ExaminationService : IExaminationService
    {
        private readonly IRepositoryManager _repository;
        private readonly IMapper _mapper;

        public ExaminationService(IRepositoryManager repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ExaminationRecordDetailDTO>> GetAllExaminationsAsync(bool trackChanges)
        {
            var examinations = await _repository.Examination.GetAllExaminationsAsync(trackChanges);
            var examinationsDto = _mapper.Map<IEnumerable<ExaminationRecordDetailDTO>>(examinations);
            return examinationsDto;
        }

        public async Task<ExaminationRecordDetailDTO> GetExaminationByIdAsync(Guid examinationId, bool trackChanges)
        {
            var examination = await GetExaminationAndCheckIfItExists(examinationId, trackChanges);
            var examinationDto = _mapper.Map<ExaminationRecordDetailDTO>(examination);
            return examinationDto;
        }

        public async Task<ExaminationRecordDetailDTO> CreateExaminationAsync(ExaminationRecordForCreationDto examinationForCreation)
        {
            var examinationEntity = _mapper.Map<ExaminationRecord>(examinationForCreation);
            examinationEntity.Id = Guid.NewGuid();

            _repository.Examination.CreateExamination(examinationEntity);
            await _repository.SaveAsync();

            var examinationFromDb = await _repository.Examination.GetExaminationByIdAsync(
                examinationEntity.Id,
                trackChanges: false,
                e => e.Animal,
                e => e.Veterinarian);

            var examinationToReturn = _mapper.Map<ExaminationRecordDetailDTO>(examinationFromDb);
            return examinationToReturn;
        }

        public async Task UpdateExaminationAsync(Guid examinationId, ExaminationRecordForUpdateDto examinationForUpdate, bool trackChanges)
        {
            var examinationEntity = await GetExaminationAndCheckIfItExists(examinationId, trackChanges);

            _mapper.Map(examinationForUpdate, examinationEntity);

            await _repository.SaveAsync();
        }

        public async Task<(ExaminationRecordForUpdateDto examinationForPatch, ExaminationRecord examinationEntity)> GetExaminationForPatchAsync(Guid id)
        {
            var examination = await GetExaminationAndCheckIfItExists(id, true);

            var examinationDto = _mapper.Map<ExaminationRecordForUpdateDto>(examination);
            return (examinationForPatch: examinationDto, examinationEntity: examination);
        }

        public async Task SaveChangesForPatchAsync(ExaminationRecordForUpdateDto patch, ExaminationRecord examination)
        {
            _mapper.Map(patch, examination);
            await _repository.SaveAsync();
        }

        public async Task DeleteExaminationAsync(Guid examinationId, bool trackChanges)
        {
            var examination = await GetExaminationAndCheckIfItExists(examinationId, trackChanges);

            _repository.Examination.Delete(examination);
            await _repository.SaveAsync();
        }

        private async Task<ExaminationRecord> GetExaminationAndCheckIfItExists(Guid id, bool trackChanges)
        {
            var examination = await _repository.Examination.GetExaminationByIdAsync(
                id,
                trackChanges,
                e => e.Animal,
                e => e.Veterinarian);

            if (examination == null)
                throw new Exception("Examination record not found");

            return examination;
        }
    }
}
