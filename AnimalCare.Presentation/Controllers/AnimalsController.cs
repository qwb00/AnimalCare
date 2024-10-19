using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Contracts;

namespace AnimalCare.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetAnimal(Guid id)
        {
            var animal = await _service.AnimalService.GetAnimalAsync(id, false);

            return Ok(animal);
        }

    }
}
