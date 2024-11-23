using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects.UsersDTO
{
    public record UserForCreateDTO : UserForManipulationDTO
    {
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; init; }
    }
}
