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
        Task<(UserForUpdateDTO userForPatch, User userEntity)> GetUserForPatchAsync(string name);
        Task<IdentityResult> SaveChangesForPatchAsync(UserForUpdateDTO patch, User user);
        Task<IdentityResult> SaveChangesForPatchAsync(ChangeStatusForVolunteerDTO patch, Volunteer volunteer);
        Task<UserDetailDTO> GetUserByUsernameAsync(string username);
        Task<(UserForUpdateDTO userForPatch, User userEntity)> GetUserForPatchAsync(Guid id);
    }
}
