using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Models.Entities;
using Service.Contracts;
using Shared.DataTransferObjects.UsersDTO;

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
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _service.UserService.GetAllUsersAsync();

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

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _service.UserService.SaveChangesForPatchAsync(result.userForPatch, result.userEntity);

            return NoContent();
        }


        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            await _service.UserService.DeleteUserAsync(id);
            return NoContent();
        }
    }
}
