using Shared.Enums;

namespace Shared.DataTransferObjects.UsersDTO
{
    public record ChangeStatusForVolunteerDTO
    {
        public bool IsVerified { get; init; }
        public VolunteerStatus VolunteerStatus { get; init; }
        public bool IsActive { get; init; }
    }
}
