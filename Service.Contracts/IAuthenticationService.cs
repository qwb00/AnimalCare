using Microsoft.AspNetCore.Identity;
using Shared.DataTransferObjects.UsersDTO;

namespace Service.Contracts
{
    public interface IAuthenticationService
    {
        Task<IdentityResult> RegisterUser(UserForCreateDTO userForRegistration);
        Task<bool> ValidateUser(UserForAuthenticationDTO userForAuth);
        Task<string> CreateToken();
    }
}
