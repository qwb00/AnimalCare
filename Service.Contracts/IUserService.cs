using Shared.DataTransferObjects.UsersDTO;

namespace Service.Contracts
{
    public interface IUserService
    {
        Task<IEnumerable<UserListDTO>> GetAllUsersAsync();
    }
}
