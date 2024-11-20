using AutoMapper;
using Contracts;
using Models.Entities;
using Service.Contracts;
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

        public async Task<MedicationScheduleDTO> CreateMedicationAsync(Guid treatmentId, MedicationScheduleForCreationDTO medication, bool trackChanges)
        {
            await CheckIfTreatmentExists(treatmentId, trackChanges);
            var medicationEntity = _mapper.Map<MedicationSchedule>(medication);

            _repository.Medication.CreateMedcicationForTreatment(treatmentId, medicationEntity);
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

        private async Task CheckIfTreatmentExists(Guid treatmentId, bool trackChanges)
        {
            var treatment = await _repository.Examination.GetByIdAsync(treatmentId, trackChanges);
            if (treatment is null)
                throw new Exception("Examination not found");
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
