using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Contracts;

namespace AnimalCare.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnimalsController : ControllerBase
    {
        private readonly IServiceManager _service;
        public AnimalsController(IServiceManager service) => _service = service;

        /// <summary>
        /// Gets the list of all animals
        /// </summary>
        /// <returns>The animals list</returns>
        [HttpGet(Name = "GetAnimals")]
        //[Authorize(Roles = "All")]
        public async Task<IActionResult> GetAnimals()
        {
            var animals = await _service.AnimalService.GetAllAnimalsAsync(trackChanges: false);

            return Ok(animals);
        }   

    }
}
