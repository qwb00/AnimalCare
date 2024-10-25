namespace Shared.DataTransferObjects.UsersDTO
{
    public record VolunteerForUpdateDTO : UserForManipulationDTO
    {
        public bool IsVerified { get; init; }
    }
}
