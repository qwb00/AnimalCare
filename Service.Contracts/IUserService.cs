using Microsoft.AspNetCore.Identity;
using Models.Entities;
using Shared.DataTransferObjects.UsersDTO;

namespace Service.Contracts
{
    public interface IUserService
    {
        Task<IEnumerable<UserListDTO>> GetAllUsersAsync();
        Task DeleteUserAsync(Guid userId);
        Task<UserDetailDTO> GetUserAsync(Guid userId);
        Task<IEnumerable<VolunteerListDTO>> GetVolunteersAsync();
        Task<(ChangeStatusForVolunteerDTO volunteerForPatch, Volunteer volunteerEntity)> GetVolunteerForPatchAsync(Guid id);
        Task<IdentityResult> SaveChangesForPatchAsync(ChangeStatusForVolunteerDTO patch, Volunteer user);
    }
}
