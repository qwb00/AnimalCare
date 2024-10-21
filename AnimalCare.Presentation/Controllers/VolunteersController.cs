using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Service.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnimalCare.Presentation.Controllers
{
    [ApiController]
    [Route("api/volunteers")]
    [Authorize(Roles = "Caretaker")]
    public class VolunteersController : ControllerBase
    {
        private readonly IServiceManager _service;
        public VolunteersController(IServiceManager service) => _service = service;

        [HttpGet(Name = "GetVolunteers")]
        public async Task<IActionResult> GetVolunteers()
        {
            var companies = await _service.UserService.GetVolunteersAsync(trackChanges: false);

            return Ok(companies);
        }


        [HttpGet("{id:guid}", Name = "GetUserById")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            var user = await _service.UserService.GetVolunteerAsync(id);
            return Ok(user);
        }

        [HttpPatch("{id:guid}")]
        public async Task<IActionResult> PartiallyUpdateEmployeeForCompany(Guid id,
        [FromBody] JsonPatchDocument<VolunteerForApproveDTO> patchDoc)
        {
            if (patchDoc is null)
                return BadRequest("patchDoc object sent from client is null.");

            var result = await _service.UserService.GetVolunteerForPatchAsync(id, trackChanges: true);

            patchDoc.ApplyTo(result.employeeToPatch, ModelState);

            // validate correct objects before to save in db
            TryValidateModel(result.employeeToPatch);

            if (!ModelState.IsValid)
                return UnprocessableEntity(ModelState);

            await _service.UserService.SaveChangesForPatchAsync(result.employeeToPatch, result.employeeEntity);

            return NoContent();
        }
    }
}
