using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Contracts;
using Shared.DataTransferObjects.AnimalsDTO;
using Microsoft.AspNetCore.JsonPatch;

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

        [HttpGet("{id:guid}", Name = "AnimalById")]
        public async Task<IActionResult> GetAnimal(Guid id)
        {
            var animal = await _service.AnimalService.GetAnimalAsync(id, false);

            return Ok(animal);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAnimal([FromBody] AnimalForCreating animal)
        {
            var createdAnimal = await _service.AnimalService.CreateAnimalAsync(animal);

            return CreatedAtRoute("AnimalById", new { id = createdAnimal.Name }, createdAnimal);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteAnimal(Guid id)
        {
            await _service.AnimalService.DeleteAnimalAsync(id, trackChanges: false);
            return NoContent();
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateAnimal(Guid id, [FromBody] AnimalForUpdateDTO animal)
        {
            await _service.AnimalService.UpdateAnimalAsync(id, animal, trackChanges: true);
            return NoContent();
        }

        [HttpPatch("{id:guid}")]
        public async Task<IActionResult> PartiallyUpdateEmployeeForCompany(Guid id,
       [FromBody] JsonPatchDocument<AnimalForUpdateDTO> patchDoc)
        {
            if (patchDoc is null)
                return BadRequest("patchDoc object sent from client is null.");

            var result = await _service.AnimalService.GetAnimalForPatchAsync(id);

            patchDoc.ApplyTo(result.animalForPatch, ModelState);
            // validate correct objects before to save in db
            TryValidateModel(result.animalForPatch);

            if (!ModelState.IsValid)
                return UnprocessableEntity(ModelState);

            await _service.AnimalService.SaveChangesForPatchAsync(result.animalForPatch, result.animalEntity);

            return NoContent();
        }

    }
}
