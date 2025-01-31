using AnimalCare.Presentation.ActionFilters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Service.Contracts;
using Shared.DataTransferObjects.AnimalsDTO;
using Shared.DataTransferObjects.MedicationsDTO;

namespace AnimalCare.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicationsController : ControllerBase
    {
        private readonly IServiceManager _service;

        public MedicationsController(IServiceManager service) => _service = service;

        [HttpGet]
        [Authorize(Roles = "Caretaker,Administrator,Veterinarian")]
        public async Task<IActionResult> GetExaminations()
        {
            var examinations = await _service.MedicationService.GetAllMedicationsAsync(trackChanges: false);
            return Ok(examinations);
        }

        [HttpGet("{id:guid}", Name = "GetMedicationById")]
        [Authorize(Roles = "Caretaker,Administrator,Veterinarian")]
        public async Task<IActionResult> GetExaminationById(Guid id)
        {
            var examination = await _service.MedicationService.GetMedicationByIdAsync(id, trackChanges: false);
            if (examination == null)
                return NotFound();

            return Ok(examination);
        }

        [HttpPost]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        [Authorize(Roles = "Veterinarian,Administrator")]
        public async Task<IActionResult> CreateMedication([FromBody] MedicationScheduleForCreationDTO medicationForCreation)
        {
            if (medicationForCreation == null)
                return BadRequest("ExaminationRecordForCreationDto object is null");

            var createdExamination = await _service.MedicationService.CreateMedicationAsync(medicationForCreation, trackChanges: false);

            return Ok(createdExamination);
        }

        [HttpPut("{id:guid}")]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        [Authorize(Roles = "Administrator,Veterinarian")]
        public async Task<IActionResult> UpdateMedication(Guid id, [FromBody] MedicationScheduleForUpdateDTO medication)
        {
            await _service.MedicationService.UpdateMedicationAsync(id, medication, trackChanges: true);
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Caretaker,Administrator,Veterinarian")]
        public async Task<IActionResult> DeleteMedication(Guid id)
        {
            await _service.MedicationService.DeleteMedicationAsync(id, trackChanges: false);
            return NoContent();
        }
    }
}
