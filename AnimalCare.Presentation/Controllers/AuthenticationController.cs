using Microsoft.AspNetCore.Mvc;
using Service.Contracts;

namespace AnimalCare.Presentation.Controllers
{
    [Route("api/authentication")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IServiceManager _service;
        public AuthenticationController(IServiceManager service) => _service = service;

        [HttpPost]
     //   [ServiceFilter(typeof(ValidationFilterAttribute))]
        public async Task<IActionResult> RegisterUser([FromBody] UserForRegistrationDTO userForRegistration)
        {
            var result = await _service.AuthenticationService.RegisterUser(userForRegistration);

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

        [HttpPost("login")]
    //    [ServiceFilter(typeof(ValidationFilterAttribute))]
        public async Task<IActionResult> Authenticate([FromBody] UserForAuthenticationDTO userForAuthentication)
        {
            if (!await _service.AuthenticationService.ValidateUser(userForAuthentication))
            {
                return Unauthorized();
            }

            return Ok(new
            {
                Token = await _service.AuthenticationService.CreateToken()
            });
        }
    }
}
