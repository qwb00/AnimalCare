using Microsoft.AspNetCore.Mvc;
using Service.Contracts;
using Microsoft.AspNetCore.Authorization;
using Shared.DataTransferObjects.ExaminationRecordsDTO;
using Microsoft.AspNetCore.JsonPatch;
using System.Security.Claims;
using AnimalCare.Presentation.ActionFilters;
using Microsoft.AspNetCore.Identity;

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
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        [Authorize(Roles = "Caretaker,Administrator")]
        public async Task<IActionResult> CreateExamination([FromBody] ExaminationRecordForCreationDTO examinationForCreation)
        {
            var createdExamination = await _service.ExaminationService.CreateExaminationAsync(examinationForCreation);

            return CreatedAtRoute("GetExaminationById", new { id = createdExamination.Id }, createdExamination);
        }

        // PATCH: api/Examinations/{id}
        [HttpPatch("{id:guid}", Name = "PatchExamination")]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        [Authorize(Roles = "Administrator,Veterinarian")]
        public async Task<IActionResult> UpdateExamination(Guid id, [FromBody] JsonPatchDocument<ExaminationRecordForUpdateDTO> patchDoc)
        {
            if (patchDoc is null)
                return BadRequest("patchDoc object sent from client is null.");

            var result = await _service.ExaminationService.GetExaminationForPatchAsync(id);

            patchDoc.ApplyTo(result.examinationForPatch, ModelState);
            // validate correct objects before to save in db
            TryValidateModel(result.examinationForPatch);

            if (!ModelState.IsValid)
                return UnprocessableEntity(ModelState);

            await _service.ExaminationService.SaveChangesForPatchAsync(result.examinationForPatch, result.examinationEntity);

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
