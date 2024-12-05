using AnimalCare.Presentation.ActionFilters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Service.Contracts;
using Shared.DataTransferObjects.UsersDTO;
using Shared.RequestFeatures;

namespace AnimalCare.Presentation.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IServiceManager _service;
        public UsersController(IServiceManager service) => _service = service;

        [HttpGet(Name = "GetUsers")]
        [Authorize(Roles = "Administrator,Caretaker")]
        public async Task<IActionResult> GetUsers([FromQuery] UserParameters userParameters)
        {
            var users = await _service.UserService.GetAllUsersAsync(userParameters);
            return Ok(users);
        }


        [HttpGet("{id:guid}", Name = "GetUserById")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            var user = await _service.UserService.GetUserAsync(id);
            return Ok(user);
        }

        [HttpGet("me", Name = "GetCurrentUser")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var username = User.Identity.Name;

            if (string.IsNullOrEmpty(username))
                return Unauthorized("Username is not available in token");

            var user = await _service.UserService.GetUserByUsernameAsync(username);

            return Ok(user);
        }

        [HttpPost]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> CreateUser([FromBody] UserForCreateDTO user)
        {
            var result = await _service.AuthenticationService.RegisterUser(user);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return BadRequest(ModelState);
            }

            return StatusCode(201);
        }

        [HttpPatch("me", Name = "UpdateCurrentUser")]
        public async Task<IActionResult> UpdateCurrentUser([FromBody] JsonPatchDocument<UserForUpdateDTO> patchDoc)
        {
            var username = User.Identity.Name;

            if (string.IsNullOrEmpty(username))
                return Unauthorized("Username is not available in token");

            var result = await _service.UserService.GetUserForPatchAsync(username);

            patchDoc.ApplyTo(result.userForPatch, ModelState);

            TryValidateModel(result.userForPatch);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _service.UserService.SaveChangesForPatchAsync(result.userForPatch, result.userEntity);

            return NoContent();
        }
        
        [HttpPatch("{id:guid}", Name = "PatchUserById")]
        [Authorize(Roles = "Administrator,Caretaker")]
        public async Task<IActionResult> PatchUserById(Guid id, [FromBody] JsonPatchDocument<UserForUpdateDTO> patchDoc)
        {
            if (patchDoc == null)
            {
                return BadRequest("Patch document is null");
            }

            var userForPatchResult = await _service.UserService.GetUserForPatchAsync(id);

            patchDoc.ApplyTo(userForPatchResult.userForPatch, ModelState);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _service.UserService.SaveChangesForPatchAsync(userForPatchResult.userForPatch, userForPatchResult.userEntity);

            return NoContent();
        }
        
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Administrator,Caretaker")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            await _service.UserService.DeleteUserAsync(id);
            return NoContent();
        }
    }
}
