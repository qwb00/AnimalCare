using Microsoft.AspNetCore.Identity;
using Models.Entities;
using Shared.DataTransferObjects.UsersDTO;
using Shared.RequestFeatures;

namespace Service.Contracts
{
    public interface IUserService
    {
        Task<IEnumerable<UserListDTO>> GetAllUsersAsync(UserParameters userParameters);
        Task DeleteUserAsync(Guid userId);
        Task<UserDetailDTO> GetUserAsync(Guid userId);
        Task<IEnumerable<VolunteerListDTO>> GetVolunteersAsync(VolunteerParameters volunteerParameters);
        Task<(ChangeStatusForVolunteerDTO volunteerForPatch, Volunteer volunteerEntity)> GetVolunteerForPatchAsync(Guid id);
        Task<(UserForUpdateDTO userForPatch, User userEntity)> GetUserForPatchAsync(string name);
        Task<IdentityResult> SaveChangesForPatchAsync(UserForUpdateDTO patch, User user);
        Task<IdentityResult> SaveChangesForPatchAsync(ChangeStatusForVolunteerDTO patch, Volunteer volunteer);
        Task<UserDetailDTO> GetUserByUsernameAsync(string username);
        Task<(UserForUpdateDTO userForPatch, User userEntity)> GetUserForPatchAsync(Guid id);
    }
}
