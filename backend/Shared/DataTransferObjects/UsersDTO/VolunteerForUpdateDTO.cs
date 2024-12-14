using Shared.Enums;

namespace Shared.DataTransferObjects.UsersDTO
{
    public record VolunteerForUpdateDTO : UserForManipulationDTO
    {
        public bool IsVerified { get; init; }
        public VolunteerStatus VolunteerStatus { get; init; }
        public bool IsActive { get; init; }
    }
}
