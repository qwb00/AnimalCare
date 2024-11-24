using System.Security.Claims;
using AnimalCare.Presentation.ActionFilters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Models.Entities;
using Service.Contracts;
using Shared.DataTransferObjects.ReservationsDTO;

namespace AnimalCare.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationsController : ControllerBase
    {
        private readonly IServiceManager _service;
        private readonly UserManager<User> _userManager;
        
        public ReservationsController(IServiceManager service, UserManager<User> userManager)
        {
            _service = service;
            _userManager = userManager;
        }

        // GET: api/Reservations
        [HttpGet(Name = "GetReservations")]
        public async Task<IActionResult> GetReservations()
        {
            var reservations = await _service.ReservationService.GetAllReservationsAsync(trackChanges: false);
            return Ok(reservations);
        }

        // POST: api/Reservations
        [HttpPost(Name = "CreateReservation")]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        [Authorize]
        public async Task<IActionResult> CreateReservation([FromBody] ReservationForCreationDTO reservationRequest)
        {
            if (reservationRequest == null)
                return BadRequest("ReservationForCreationDto object is null");

            var user = await _userManager.FindByIdAsync(reservationRequest.UserId.ToString());
            if (user == null)
                return NotFound("User not found.");

            var isVolunteer = await _userManager.IsInRoleAsync(user, "Volunteer");
            if (isVolunteer)
            {
                if (user is Volunteer volunteer && !volunteer.IsVerified)
                {
                    return BadRequest("Unverified volunteers cannot create reservations.");
                }
            }

            var createdReservation = await _service.ReservationService.CreateReservationAsync(reservationRequest);
            return CreatedAtRoute("GetReservationById", new { id = createdReservation.Id }, createdReservation);
        }
        
        // GET: api/Reservations/{id}
        [Authorize(Roles = "Caretaker,Administrator,Volunteer")]
        [HttpGet("{id:guid}", Name = "GetReservationById")]
        public async Task<IActionResult> GetReservationById(Guid id)
        {
            var reservation = await _service.ReservationService.GetReservationByIdAsync(id, trackChanges: false);
            if (reservation == null)
                return NotFound();

            return Ok(reservation);
        }

        // PATCH: api/Reservations/{id}
        [HttpPatch("{id:guid}", Name = "PartiallyUpdateReservation")]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        [Authorize(Roles = "Caretaker,Administrator")]
        public async Task<IActionResult> PartiallyUpdateReservation(Guid id, [FromBody] JsonPatchDocument<ReservationForUpdateDTO> patchDoc)
        {
            if (patchDoc == null)
                return BadRequest("patchDoc object is null");

            var reservationToPatch = await _service.ReservationService.GetReservationForPatchAsync(id, trackChanges: true);

            if (reservationToPatch == null)
                return NotFound();

            patchDoc.ApplyTo(reservationToPatch, ModelState);

            if (!TryValidateModel(reservationToPatch))
                return ValidationProblem(ModelState);

            await _service.ReservationService.SavePatchedReservationAsync(id, reservationToPatch, trackChanges: true);

            return NoContent();
        }
        
        // GET: api/Reservations/User/{userId}
        [HttpGet("User/{userId:guid}", Name = "GetReservationsByUserId")]
        [Authorize(Roles = "Volunteer,Caretaker,Administrator")]
        public async Task<IActionResult> GetReservationsByUserId(Guid userId)
        {
            var reservations = await _service.ReservationService.GetReservationsByVolunteerIdAsync(userId, trackChanges: false);
            return Ok(reservations);
        }

        // DELETE: api/Reservations/{id}
        [HttpDelete("{id:guid}", Name = "DeleteReservation")]
        [Authorize(Roles = "Caretaker,Administrator")]
        public async Task<IActionResult> DeleteReservation(Guid id)
        {
            await _service.ReservationService.DeleteReservationAsync(id, trackChanges: false);
            return NoContent();
        }
    }
}
