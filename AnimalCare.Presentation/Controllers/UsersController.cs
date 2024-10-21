using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Contracts;
using Shared.DataTransferObjects.UsersDTO;

namespace AnimalCare.Presentation.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize(Roles = "Administrator")]
    public class UsersController : ControllerBase
    {
        private readonly IServiceManager _service;
        public UsersController(IServiceManager service) => _service = service;

        [HttpGet(Name = "GetUsers")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _service.UserService.GetAllUsersAsync();

            return Ok(users);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] UserForCreateDTO user)
        {
            var createdUser = await _service.AuthenticationService.RegisterUser(user);

            return Created(string.Empty, createdUser);
        }


        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            await _service.UserService.DeleteUserAsync(id);
            return NoContent();
        }
    }
}
