// AnimalCare.Presentation/Controllers/ExaminationsController.cs
using Microsoft.AspNetCore.Mvc;
using Service.Contracts;
using Shared.DataTransferObjects;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Shared.DataTransferObjects.ExaminationRecordsDTO;

namespace AnimalCare.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExaminationsController : ControllerBase
    {
        private readonly IServiceManager _service;

        public ExaminationsController(IServiceManager service) => _service = service;

        // GET: api/Examinations
        [HttpGet(Name = "GetExaminations")]
        [Authorize(Roles = "Caretaker,Administrator,Veterinarian")]
        public async Task<IActionResult> GetExaminations()
        {
            var examinations = await _service.ExaminationService.GetAllExaminationsAsync(trackChanges: false);
            return Ok(examinations);
        }

        // GET: api/Examinations/{id}
        [HttpGet("{id:guid}", Name = "GetExaminationById")]
        [Authorize(Roles = "Caretaker,Administrator,Veterinarian")]
        public async Task<IActionResult> GetExaminationById(Guid id)
        {
            var examination = await _service.ExaminationService.GetExaminationByIdAsync(id, trackChanges: false);
            if (examination == null)
                return NotFound();

            return Ok(examination);
        }

        // POST: api/Examinations
        [HttpPost(Name = "CreateExamination")]
        [Authorize(Roles = "Caretaker,Administrator")]
        public async Task<IActionResult> CreateExamination([FromBody] ExaminationRecordForCreationDto examinationForCreation)
        {
            if (examinationForCreation == null)
                return BadRequest("ExaminationRecordForCreationDto object is null");

            var createdExamination = await _service.ExaminationService.CreateExaminationAsync(examinationForCreation);

            return CreatedAtRoute("GetExaminationById", new { id = createdExamination.Id }, createdExamination);
        }

        // PATCH: api/Examinations/{id}
        [HttpPatch("{id:guid}", Name = "UpdateExamination")]
        [Authorize(Roles = "Administrator,Veterinarian")]
        public async Task<IActionResult> UpdateExamination(Guid id, [FromBody] ExaminationRecordForUpdateDto examinationForUpdate)
        {
            if (examinationForUpdate == null)
                return BadRequest("ExaminationRecordForUpdateDto object is null");

            await _service.ExaminationService.UpdateExaminationAsync(id, examinationForUpdate, trackChanges: true);

            return NoContent();
        }

        // DELETE: api/Examinations/{id}
        [HttpDelete("{id:guid}", Name = "DeleteExamination")]
        [Authorize(Roles = "Caretaker,Administrator,Veterinarian")]
        public async Task<IActionResult> DeleteExamination(Guid id)
        {
            await _service.ExaminationService.DeleteExaminationAsync(id, trackChanges: false);
            return NoContent();
        }
    }
}
