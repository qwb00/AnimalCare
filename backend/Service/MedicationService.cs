using AutoMapper;
using Contracts;
using Models.Entities;
using Service.Contracts;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.MedicationsDTO;

namespace Service
{
    public class MedicationService : IMedicationService
    {
        private readonly IRepositoryManager _repository;
        private readonly IMapper _mapper;

        public MedicationService(IRepositoryManager repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<MedicationScheduleDTO>> GetAllMedicationsAsync(bool trackChanges)
        {
            var medications = await _repository.Medication.GetAllMedicationsAsync(trackChanges);
            var medicationsDto = _mapper.Map<IEnumerable<MedicationScheduleDTO>>(medications);
            return medicationsDto;
        }

        public async Task<MedicationScheduleDTO> GetMedicationByIdAsync(Guid medicationId, bool trackChanges)
        {
            var medication = await GetMedicationAndCheckIfItExists(medicationId, trackChanges);
            var medicationDto = _mapper.Map<MedicationScheduleDTO>(medication);
            return medicationDto;
        }

        public async Task<MedicationScheduleDTO> CreateMedicationAsync(MedicationScheduleForCreationDTO medication, bool trackChanges)
        {
            var medicationEntity = _mapper.Map<MedicationSchedule>(medication);

            _repository.Medication.CreateMedcication(medicationEntity);
            await _repository.SaveAsync();

            var medicationToReturn = _mapper.Map<MedicationScheduleDTO>(medicationEntity);

            return medicationToReturn;
        }

        public async Task DeleteMedicationAsync(Guid medicationId, bool trackChanges)
        {
            var medication = await GetMedicationAndCheckIfItExists(medicationId, trackChanges);

            _repository.Medication.Delete(medication);
            await _repository.SaveAsync();
        }

        private async Task<MedicationSchedule> GetMedicationAndCheckIfItExists(Guid id, bool trackChanges)
        {
            var medication = await _repository.Medication.GetByIdAsync(id, trackChanges);
            if (medication is null)
                throw new Exception("medication not found");

            return medication;
        }
    }
}
