using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Service.Contracts;
using Shared.DataTransferObjects.UsersDTO;

namespace AnimalCare.Presentation.Controllers
{
    [ApiController]
    [Route("api/volunteers")]
    [Authorize(Roles = "Caretaker,Administrator")]
    public class VolunteersController : ControllerBase
    {
        private readonly IServiceManager _service;
        public VolunteersController(IServiceManager service) => _service = service;

        [HttpGet(Name = "GetVolunteers")]
        public async Task<IActionResult> GetVolunteers()
        {
            var companies = await _service.UserService.GetVolunteersAsync();

            return Ok(companies);
        }

        [HttpPatch("{id:guid}")]
        public async Task<IActionResult> PartiallyUpdateEmployeeForCompany(Guid id,
        [FromBody] JsonPatchDocument<ChangeStatusForVolunteerDTO> patchDoc)
        {
            if (patchDoc is null)
                return BadRequest("patchDoc object sent from client is null.");

            var result = await _service.UserService.GetVolunteerForPatchAsync(id);

            patchDoc.ApplyTo(result.volunteerForPatch, ModelState);
            // validate correct objects before to save in db
            TryValidateModel(result.volunteerForPatch);

            if (!ModelState.IsValid)
                return UnprocessableEntity(ModelState);

            await _service.UserService.SaveChangesForPatchAsync(result.volunteerForPatch, result.volunteerEntity);

            return NoContent();
        }
    }
}
